import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/AdminLayout'
import { 
  Search, 
  Users, 
  ShoppingBag, 
  IndianRupee,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  X
} from 'lucide-react'

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [customerOrders, setCustomerOrders] = useState([])
  const toast = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Group orders by customer
      const customerMap = {}
      
      orders?.forEach(order => {
        const key = order.customer_phone // Use phone as unique identifier
        
        if (!customerMap[key]) {
          customerMap[key] = {
            name: order.customer_name,
            phone: order.customer_phone,
            address: order.address,
            email: order.customer_email || 'N/A',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.created_at,
            firstOrderDate: order.created_at,
            orders: []
          }
        }
        
        customerMap[key].totalOrders++
        customerMap[key].totalSpent += parseFloat(order.total_amount || 0)
        customerMap[key].orders.push(order)
        
        // Update dates
        if (new Date(order.created_at) > new Date(customerMap[key].lastOrderDate)) {
          customerMap[key].lastOrderDate = order.created_at
        }
        if (new Date(order.created_at) < new Date(customerMap[key].firstOrderDate)) {
          customerMap[key].firstOrderDate = order.created_at
        }
      })

      // Convert to array and sort by total spent
      const customersArray = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent)
      
      setCustomers(customersArray)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.show('Failed to load customers', 'error')
    } finally {
      setLoading(false)
    }
  }

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer)
    setCustomerOrders(customer.orders)
    setShowModal(true)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCustomerSegment = (totalSpent) => {
    if (totalSpent >= 2000) return { label: 'VIP', color: 'bg-purple-100 text-purple-700' }
    if (totalSpent >= 1000) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-700' }
    if (totalSpent >= 500) return { label: 'Silver', color: 'bg-gray-100 text-gray-700' }
    return { label: 'Bronze', color: 'bg-orange-100 text-orange-700' }
  }

  const CustomerModal = () => {
    if (!selectedCustomer) return null

    const segment = getCustomerSegment(selectedCustomer.totalSpent)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedCustomer.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${segment.color}`}>
                    {segment.label} Customer
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-orange-600">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin size={18} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900">{selectedCustomer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <ShoppingBag className="mx-auto text-blue-500 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <IndianRupee className="mx-auto text-green-500 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">Avg Order Value</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Calendar className="mx-auto text-purple-500 mb-2" size={24} />
                <p className="text-sm font-bold text-gray-900">{formatDate(selectedCustomer.lastOrderDate)}</p>
                <p className="text-sm text-gray-500">Last Order</p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order History</h3>
              <div className="space-y-3">
                {customerOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {(() => {
                        try {
                          const items = JSON.parse(order.items_json || '[]')
                          return `${items.length} item${items.length !== 1 ? 's' : ''}`
                        } catch {
                          return 'Order details unavailable'
                        }
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate summary stats
  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  const topCustomer = customers[0]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
            <p className="text-gray-600">View and analyze your customer base</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <IndianRupee className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Avg Customer Value</p>
                  <p className="text-3xl font-bold text-gray-900">₹{avgCustomerValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Top Customer</p>
                  <p className="text-lg font-bold text-gray-900">{topCustomer?.name || 'N/A'}</p>
                  <p className="text-sm text-orange-600 font-semibold">₹{topCustomer?.totalSpent.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <Users className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg">No customers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer, idx) => {
                      const segment = getCustomerSegment(customer.totalSpent)
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{customer.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{customer.phone}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {customer.totalOrders}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-green-600">
                            ₹{customer.totalSpent.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${segment.color}`}>
                              {segment.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(customer.lastOrderDate)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => viewCustomerDetails(customer)}
                              className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1"
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Modal */}
          {showModal && <CustomerModal />}
        </div>
      </div>
    </AdminLayout>
  )
}
