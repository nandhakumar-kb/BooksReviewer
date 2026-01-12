import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/AdminLayout'
import { 
  ShoppingBag, 
  BookOpen, 
  Users, 
  IndianRupee, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBooks: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCombos: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch books count
      const { count: booksCount, error: booksError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })

      if (booksError) throw booksError

      // Fetch combos count
      const { count: combosCount, error: combosError } = await supabase
        .from('combos')
        .select('*', { count: 'exact', head: true })

      if (combosError) throw combosError

      // Calculate stats (exclude cancelled orders from revenue)
      const totalRevenue = orders?.reduce((sum, order) => {
        if (order.status === 'Cancelled') return sum
        return sum + parseFloat(order.total_amount || 0)
      }, 0) || 0
      const pendingOrders = orders?.filter(o => o.status === 'Pending').length || 0

      setStats({
        totalOrders: orders?.length || 0,
        totalBooks: booksCount || 0,
        totalCombos: combosCount || 0,
        totalRevenue,
        pendingOrders,
        recentOrders: orders?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.show('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            color="text-blue-600"
            subtext={`${stats.pendingOrders} pending`}
          />
          <StatCard
            icon={IndianRupee}
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            color="text-green-600"
          />
          <StatCard
            icon={BookOpen}
            label="Total Books"
            value={stats.totalBooks}
            color="text-purple-600"
          />
          <StatCard
            icon={Package}
            label="Total Combos"
            value={stats.totalCombos}
            color="text-orange-600"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}
