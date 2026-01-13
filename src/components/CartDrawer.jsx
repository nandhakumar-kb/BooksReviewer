import { X, Minus, Plus, Trash2, Tag, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useFocusTrap from '../hooks/useFocusTrap'
import EmptyState from './EmptyState'
import { PROMO_CODES } from '../lib/constants'

export default function CartDrawer() {
    const {
        isCartOpen,
        setIsCartOpen,
        cart,
        updateQuantity,
        removeFromCart,
        totalAmount
    } = useCart()
    const navigate = useNavigate()
    const toast = useToast()
    const drawerRef = useFocusTrap(isCartOpen)
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [promoError, setPromoError] = useState('')

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            setPromoCode('')
            setDiscount(0)
            setPromoError('')
        }
    }, [isCartOpen])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false)
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isCartOpen, setIsCartOpen])

    const applyPromoCode = () => {
        const code = promoCode.trim().toUpperCase()
        if (PROMO_CODES[code]) {
            setDiscount(PROMO_CODES[code].discount)
            setPromoError('')
            toast.success(`Promo code applied! ${PROMO_CODES[code].label}`)
        } else {
            setPromoError('Invalid promo code')
            setDiscount(0)
            toast.error('Invalid promo code')
        }
    }

    const handleRemoveItem = (item) => {
        if (window.confirm(`Remove \"${item.title}\" from cart?`)) {
            removeFromCart(item.id)
            toast.info('Item removed from cart')
        }
    }

    const discountAmount = totalAmount * discount
    const finalTotal = totalAmount - discountAmount

    if (!isCartOpen) return null

    const handleCheckout = () => {
        setIsCartOpen(false)
        navigate('/checkout')
    }

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div ref={drawerRef} className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {cart.length === 0 ? (
                        <EmptyState
                            icon={ShoppingBag}
                            title="Your cart is empty"
                            description="Start adding books to your cart and they'll appear here!"
                            actionLabel="Continue Shopping"
                            onAction={() => setIsCartOpen(false)}
                        />
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-3 sm:gap-4 p-3 bg-gray-50 rounded-xl">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md flex-shrink-0"
                                />
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{item.title}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{item.author}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm sm:text-base">\u20b9{item.price}</span>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-xs sm:text-sm w-4 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item)}
                                    className="text-gray-400 hover:text-red-500 self-start p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded flex-shrink-0"
                                    aria-label={`Remove ${item.title} from cart`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-white space-y-4">
                        {/* Promo Code */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter promo code"
                                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-400 outline-none text-sm"
                                    />
                                </div>
                                <button
                                    onClick={applyPromoCode}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && <p className="text-xs text-red-500">{promoError}</p>}
                            {discount > 0 && <p className="text-xs text-green-600 font-semibold">✓ {(discount * 100)}% discount applied!</p>}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toFixed(0)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-semibold">
                                    <span>Discount ({(discount * 100)}%)</span>
                                    <span>-₹{discountAmount.toFixed(0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(0)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
