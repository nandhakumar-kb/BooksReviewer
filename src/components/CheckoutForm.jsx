import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabaseClient'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'

export default function CheckoutForm() {
    const { cart, totalAmount, clearCart } = useCart()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!formData.name || !formData.phone || !formData.address) {
                throw new Error("Please fill in all fields")
            }

            // 1. Insert Order into Supabase
            const { error: dbError } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: formData.name,
                        customer_phone: formData.phone,
                        address: formData.address,
                        total_amount: totalAmount,
                        items_json: cart,
                        status: 'Pending'
                    }
                ])

            if (dbError) throw dbError

            // 2. Trigger EmailJS
            const emailParams = {
                to_name: 'Admin',
                from_name: formData.name,
                message: `New Order! Amount: $${totalAmount}. Phone: ${formData.phone}`,
                order_details: JSON.stringify(cart.map(c => `${c.title} x${c.quantity}`)),
            }

            // Note: Wrap in try/catch or assume EmailJS might fail but order is placed?
            // For MVP "Sell", better to ensure both work or warn.
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                emailParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )

            // 3. Clear Cart & Redirect
            clearCart()
            navigate('/success')

        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Checkout error:', err)
            }
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-10">
                <p>Your cart is empty.</p>
                <button onClick={() => navigate('/')} className="text-blue-600 underline">Go back</button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="123 Street Name, City"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    )
}
