import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { User, Package, LogOut, Loader, XCircle } from 'lucide-react'

export default function Account() {
    const { user, signOut, loading: authLoading } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [activeTab, setActiveTab] = useState('orders') // Track active tab

    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data)
        } catch (error) {
            toast.error('Failed to load orders')
        } finally {
            setLoadingOrders(false)
        }
    }, [user, toast])

    useEffect(() => {
        if (!authLoading && !user) navigate('/login')
        if (user) fetchOrders()
    }, [user, authLoading, navigate, fetchOrders])

    const handleLogout = async () => {
        try {
            await signOut()
            toast.success('Logged out successfully')
            navigate('/')
        } catch (error) {
            toast.error('Failed to logout')
        }
    }

    const cancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'Cancelled' })
                .eq('id', orderId)

            if (error) throw error

            // Update local state
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'Cancelled' } : order
            ))
            toast.success('Order cancelled successfully')
        } catch (error) {
            console.error('Error cancelling order:', error)
            toast.error('Failed to cancel order')
        }
    }

    if (authLoading || !user) return (
        <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-amber-500" size={48} />
        </div>
    )

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Profile Header */}
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-serif font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">

                    {/* Sidebar */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 space-y-2">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 shadow-sm transition-colors ${
                                activeTab === 'orders' 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                    : 'text-gray-600 hover:bg-orange-50'
                            }`}
                        >
                            <Package size={18} /> Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                                activeTab === 'profile' 
                                    ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600' 
                                    : 'text-gray-600 hover:bg-orange-50'
                            }`}
                        >
                            <User size={18} /> Profile Details
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="col-span-2 p-6">
                        {activeTab === 'orders' ? (
                            <>
                                <h2 className="text-lg font-bold mb-6">Recent Orders</h2>

                                {loadingOrders ? (
                                    <div className="text-center py-10">Loading orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">No orders found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">Order #{order.id}</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 mb-3">
                                                    <div className="space-y-1">
                                                        {Array.isArray(order.items_json) ? (
                                                            order.items_json.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between">
                                                                    <span>{item.title} x{item.quantity}</span>
                                                                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400">Order details not available</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                    <span className="font-bold">₹{order.total_amount}</span>
                                                    {(order.status === 'Pending' || order.status === 'Confirmed') && (
                                                        <button
                                                            onClick={() => cancelOrder(order.id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                        >
                                                            <XCircle size={16} />
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold mb-6">Profile Details</h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                                <p className="text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">{user.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                                                <p className="text-gray-600 bg-white px-4 py-3 rounded-lg border border-gray-200 text-sm font-mono">{user.id}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Created</label>
                                                <p className="text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">
                                                    {new Date(user.created_at).toLocaleDateString('en-IN', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>💡 Tip:</strong> Your profile is automatically created when you sign up. All your order history is linked to this account.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
            </div>
        </div>
    )
}
