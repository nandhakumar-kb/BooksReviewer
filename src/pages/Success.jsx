import { CheckCircle, Package, Clock, ArrowRight, Phone, Mail } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { useEffect } from 'react'

export default function Success() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId') || 'N/A'
    const total = searchParams.get('total') || '0'
    
    useEffect(() => {
        // Clear cart from localStorage on success page
        localStorage.removeItem('cart')
    }, [])
    
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
            <SEO
                title="Order Success"
                description="Your order has been placed successfully. Thank you for shopping with Books Reviewer!"
            />
            
            {/* Success Animation */}
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/50 animate-pulse-subtle">
                    <CheckCircle size={56} strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2 text-center">Order #{orderId}</p>
            <p className="text-2xl font-bold text-orange-600 mb-4">Total: ₹{total}</p>
            <p className="text-gray-500 mb-8 max-w-lg text-center leading-relaxed">
                Thank you for your purchase! We've received your order and will contact you shortly to confirm delivery details.
            </p>
            
            {/* Contact Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12 max-w-md">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Questions? Contact Us</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} className="text-blue-600" />
                        <a href="tel:+919876543210" className="hover:text-blue-600">+91 98765 43210</a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Mail size={16} className="text-blue-600" />
                        <a href="mailto:support@booksreviewer.com" className="hover:text-blue-600">support@booksreviewer.com</a>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <Clock className="text-orange-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Processing</h3>
                    <p className="text-sm text-gray-600">We'll call you within 24 hours to confirm your order</p>
                </div>
                
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Package className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Delivery</h3>
                    <p className="text-sm text-gray-600">Your books will be delivered via Cash on Delivery</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all"
                >
                    Continue Shopping
                    <ArrowRight size={20} />
                </Link>
                <Link
                    to="/account"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:-translate-y-1 transition-all"
                >
                    View Orders
                </Link>
            </div>
        </div>
    )
}
