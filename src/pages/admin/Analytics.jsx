import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/AdminLayout'
import { 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  BookOpen,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    revenueByCategory: [],
    bestSellingBooks: [],
    recentRevenue: 0,
    revenueGrowth: 0,
    ordersThisMonth: 0,
    ordersLastMonth: 0,
    salesByStatus: []
  })
  const [timeRange, setTimeRange] = useState('all') // all, month, week
  const toast = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch all books
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('*')

      if (booksError) throw booksError

      // Filter orders based on time range
      const now = new Date()
      let filteredOrders = orders || []
      
      if (timeRange === 'month') {
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
        filteredOrders = orders?.filter(o => new Date(o.created_at) >= monthAgo) || []
      } else if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filteredOrders = orders?.filter(o => new Date(o.created_at) >= weekAgo) || []
      }

      // Calculate total revenue (exclude cancelled orders)
      const totalRevenue = filteredOrders.reduce((sum, order) => {
        if (order.status === 'Cancelled') return sum
        return sum + parseFloat(order.total_amount || 0)
      }, 0)
      
      // Calculate average order value (exclude cancelled orders)
      const activeOrders = filteredOrders.filter(o => o.status !== 'Cancelled')
      const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0

      // Revenue by category (from order items)
      const categoryRevenue = {}
      const bookSales = {}

      filteredOrders.forEach(order => {
        // Skip cancelled orders for revenue calculations
        if (order.status === 'Cancelled') return
        try {
          const items = JSON.parse(order.items_json || '[]')
          items.forEach(item => {
            // Track revenue by category
            const category = item.category || 'Unknown'
            categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity)
            
            // Track book sales
            const bookKey = item.title || 'Unknown'
            if (!bookSales[bookKey]) {
              bookSales[bookKey] = { 
                title: item.title, 
                quantity: 0, 
                revenue: 0,
                author: item.author || 'Unknown'
              }
            }
            bookSales[bookKey].quantity += item.quantity
            bookSales[bookKey].revenue += item.price * item.quantity
          })
        } catch (e) {
          console.error('Error parsing order items:', e)
        }
      })

      // Convert to arrays and sort
      const revenueByCategory = Object.entries(categoryRevenue).map(([name, revenue]) => ({
        name,
        revenue: parseFloat(revenue.toFixed(2))
      })).sort((a, b) => b.revenue - a.revenue)

      const bestSellingBooks = Object.values(bookSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)

      // Calculate month-over-month growth
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      const ordersThisMonth = orders?.filter(o => new Date(o.created_at) >= thisMonth).length || 0
      const ordersLastMonth = orders?.filter(o => {
        const date = new Date(o.created_at)
        return date >= lastMonth && date <= lastMonthEnd
      }).length || 0

      const revenueThisMonth = orders?.filter(o => new Date(o.created_at) >= thisMonth)
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0
      const revenueLastMonth = orders?.filter(o => {
        const date = new Date(o.created_at)
        return date >= lastMonth && date <= lastMonthEnd
      }).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0

      const revenueGrowth = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
        : 0

      // Sales by status
      const statusCounts = {}
      filteredOrders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      })

      const salesByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }))

      setAnalytics({
        totalRevenue,
        totalOrders: filteredOrders.length,
        avgOrderValue,
        revenueByCategory,
        bestSellingBooks,
        recentRevenue: revenueThisMonth,
        revenueGrowth: parseFloat(revenueGrowth),
        ordersThisMonth,
        ordersLastMonth,
        salesByStatus
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.show('Failed to load analytics', 'error')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, subtitle, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg bg-orange-100`}>
          <Icon className="text-orange-600" size={20} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{value}</p>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>}
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
              <p className="text-sm sm:text-base text-gray-600">Track your store performance and insights</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimeRange('all')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
                  timeRange === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
                  timeRange === 'month' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
                  timeRange === 'week' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={`₹${analytics.totalRevenue.toLocaleString('en-IN')}`}
              trend={analytics.revenueGrowth}
              subtitle={`₹${analytics.recentRevenue.toLocaleString('en-IN')} this month`}
            />
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={analytics.totalOrders}
              subtitle={`${analytics.ordersThisMonth} this month`}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Order Value"
              value={`₹${analytics.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            />
            <StatCard
              icon={Calendar}
              label="Monthly Orders"
              value={analytics.ordersThisMonth}
              subtitle={`${analytics.ordersLastMonth} last month`}
            />
          </div>

          {/* Revenue by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Revenue by Category</h2>
              {analytics.revenueByCategory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.revenueByCategory.map((category, idx) => {
                    const maxRevenue = analytics.revenueByCategory[0]?.revenue || 1
                    const percentage = (category.revenue / maxRevenue) * 100
                    
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{category.name}</span>
                          <span className="text-orange-600 font-bold">₹{category.revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              {analytics.salesByStatus.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.salesByStatus.map((status, idx) => {
                    const totalOrders = analytics.totalOrders
                    const percentage = totalOrders > 0 ? (status.count / totalOrders * 100).toFixed(1) : 0
                    
                    const statusColors = {
                      'Pending': 'from-yellow-500 to-amber-500',
                      'Confirmed': 'from-blue-500 to-cyan-500',
                      'Delivered': 'from-green-500 to-emerald-500',
                      'Cancelled': 'from-red-500 to-rose-500'
                    }
                    
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{status.status}</span>
                          <span className="text-gray-600 font-bold">{status.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`bg-gradient-to-r ${statusColors[status.status] || 'from-gray-500 to-gray-600'} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Best Selling Books */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Best Selling Books</h2>
            </div>
            {analytics.bestSellingBooks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.bestSellingBooks.map((book, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                            idx === 1 ? 'bg-gray-100 text-gray-700' :
                            idx === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{book.title}</td>
                        <td className="px-6 py-4 text-gray-600">{book.author}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                            {book.quantity} units
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">
                          ₹{book.revenue.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
