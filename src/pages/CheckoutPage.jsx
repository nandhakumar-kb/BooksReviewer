import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabaseClient'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import FormInput from '../components/FormInput'
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '../lib/sanitize'

const STEPS = [
    { number: 1, label: 'CART' },
    { number: 2, label: 'ADDRESS' },
    { number: 3, label: 'PAYMENT' }
]

// Validate EmailJS configuration
const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
}
const isEmailConfigured = EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey

export default function CheckoutPage() {
    const { cart, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()
    const { user } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: user?.email || '',
        address: '',
        city: 'Namakkal',
        state: 'Tamil Nadu',
        pincode: ''
    })

    const [errors, setErrors] = useState({})

    // Redirect if cart is empty (silently, without toast to avoid spam after order completion)
    useEffect(() => {
        if (cart.length === 0) {
            const timer = setTimeout(() => navigate('/'), 100)
            return () => clearTimeout(timer)
        }
    }, [cart.length, navigate])

    const validateForm = () => {
        const newErrors = {}
        
        // Name validation
        const trimmedName = formData.name.trim()
        if (!trimmedName) newErrors.name = 'Name is required'
        else if (trimmedName.length < 2) newErrors.name = 'Name must be at least 2 characters'
        else if (trimmedName.length > 50) newErrors.name = 'Name must be less than 50 characters'
        else if (!/^[a-zA-Z\s.]+$/.test(trimmedName)) newErrors.name = 'Name can only contain letters, spaces, and dots'
        
        // Phone validation
        const trimmedPhone = formData.phone.trim()
        if (!trimmedPhone) newErrors.phone = 'Phone number is required'
        else if (!/^[6-9]\d{9}$/.test(trimmedPhone.replace(/[\s()-]/g, ''))) newErrors.phone = 'Enter a valid 10-digit Indian mobile number'
        
        // Email validation (optional but validate if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Invalid email address'
        }
        
        // Address validation
        const trimmedAddress = formData.address.trim()
        if (!trimmedAddress) newErrors.address = 'Address is required'
        else if (trimmedAddress.length < 10) newErrors.address = 'Address must be at least 10 characters'
        else if (trimmedAddress.length > 200) newErrors.address = 'Address must be less than 200 characters'
        
        // Pincode validation
        const trimmedPincode = formData.pincode.trim()
        if (!trimmedPincode) newErrors.pincode = 'Pincode is required'
        else if (!/^\d{6}$/.test(trimmedPincode)) newErrors.pincode = 'Pincode must be exactly 6 digits'
        
        setErrors(newErrors)
        
        // Scroll to first error if any
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0]
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            document.getElementById(firstErrorField)?.focus()
        }
        
        return Object.keys(newErrors).length === 0
    }

    // Calculations for UI
    const deliveryFee = 0
    const grandTotal = totalAmount + deliveryFee
    
    // Calculate total MRP and savings from actual original prices
    const totalMRP = cart.reduce((sum, item) => {
        const originalPrice = item.original_price || item.price
        return sum + (originalPrice * item.quantity)
    }, 0)
    const savedAmount = totalMRP - totalAmount
    const savingsPercent = totalMRP > 0 ? Math.round((savedAmount / totalMRP) * 100) : 0

    const handleNext = () => {
        if (currentStep === 1) {
            if (cart.length === 0) return
            setCurrentStep(2)
        } else if (currentStep === 2) {
            if (!validateForm()) return
            setCurrentStep(3)
        }
    }

    const handlePlaceOrder = async () => {
        if (loading) return // Prevent double submission
        setLoading(true)
        try {
            const { error: dbError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: user?.id || null, // Link to user if logged in
                        customer_name: formData.name,
                        customer_phone: formData.phone,
                        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                        total_amount: grandTotal,
                        items_json: cart,
                        status: 'Pending'
                    }
                ])

            if (dbError) throw dbError

            // Prepare detailed order items list for email
            const orderItemsList = cart.map(item => 
                `${item.title} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(0)}`
            ).join('\n')

            const emailParams = {
                to_name: 'Admin',
                from_name: formData.name,
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email || 'Not provided',
                customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                order_items: orderItemsList,
                total_amount: `₹${grandTotal.toFixed(0)}`,
                order_count: cart.length,
                message: `New order received from ${formData.name}`,
                reply_to: formData.email || 'noreply@example.com'
            }

            // Send email notification to admin if configured
            if (isEmailConfigured) {
                try {
                    await emailjs.send(
                        EMAILJS_CONFIG.serviceId,
                        EMAILJS_CONFIG.templateId,
                        emailParams,
                        EMAILJS_CONFIG.publicKey
                    )
                    console.log('✅ Order notification email sent to admin')
                } catch (emailError) {
                    console.warn('⚠️ Email notification failed, but order was placed:', emailError)
                    // Don't block order on email failure
                }
            } else {
                console.warn('⚠️ EmailJS not configured. Set VITE_EMAILJS_* environment variables.')
            }

            clearCart()
            toast.success('Order placed successfully!')
            navigate(`/success?orderId=${Date.now()}&total=${grandTotal.toFixed(0)}`)

        } catch (err) {
            toast.error('Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        let sanitizedValue = value
        
        if (name === 'name' || name === 'address' || name === 'city') {
            sanitizedValue = sanitizeInput(value)
        } else if (name === 'email') {
            sanitizedValue = sanitizeEmail(value)
        } else if (name === 'phone') {
            sanitizedValue = sanitizePhone(value)
        } else if (name === 'pincode') {
            sanitizedValue = value.replace(/\D/g, '').slice(0, 6)
        }
        
        setFormData({ ...formData, [name]: sanitizedValue })
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }

    const PriceDetails = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <div className="mb-4">
                <div className="text-sm font-bold text-green-600 mb-2 bg-green-50 p-2 rounded flex items-center gap-2">
                    <span>%</span> Coupons and offers <span className="text-red-500 ml-auto text-xs cursor-pointer">1 Offer &gt;</span>
                </div>
                <p className="text-xs text-gray-500">Save more with coupon and offers</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                    <span>Item total</span>
                    <span className="line-through text-gray-400">₹{totalMRP.toFixed(0)}</span>
                    <span className="font-bold text-black">₹{totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span className="text-green-600">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between text-base font-bold text-black">
                    <span>Grand total</span>
                    <span>₹{grandTotal.toFixed(0)}</span>
                </div>
                <p className="text-xs text-gray-400">Inclusive of all taxes</p>

                <div className="bg-green-50 text-green-700 text-xs p-3 rounded mt-4">
                    {savingsPercent > 0 ? (
                        <>You have saved {savingsPercent}% (₹{savedAmount.toFixed(0)}) on your order! Yay!</>
                    ) : (
                        <>Great choice! Enjoy your books!</>
                    )}
                </div>
            </div>

            <button
                onClick={currentStep === 3 ? handlePlaceOrder : handleNext}
                disabled={loading || (currentStep === 1 && cart.length === 0)}
                className="w-full mt-6 btn-primary rounded py-3 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : (currentStep === 3 ? 'Place Order' : 'Continue')}
            </button>
            
            {currentStep > 1 && (
                <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="w-full mt-3 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            )}
        </div>
    )

    return (
        <div className="bg-gray-50 py-12 pb-20">
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-bold tracking-widest text-gray-400">
                        {STEPS.map((step, idx) => (
                            <div key={step.number} className={`flex items-center gap-2 ${currentStep >= step.number ? 'text-orange-500' : ''}`}>
                                <button
                                    onClick={() => {
                                        if (step.number < currentStep) {
                                            setCurrentStep(step.number)
                                        }
                                    }}
                                    disabled={step.number > currentStep}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                        currentStep >= step.number 
                                            ? 'bg-orange-500 text-white border-orange-500 cursor-pointer hover:bg-orange-600' 
                                            : 'border-gray-300 cursor-not-allowed'
                                    } ${step.number < currentStep ? 'hover:scale-110' : ''}`}
                                    aria-label={`${step.label} - ${currentStep >= step.number ? 'Completed' : 'Not started'}`}
                                    title={step.number < currentStep ? 'Click to return to this step' : undefined}
                                >
                                    {currentStep > step.number ? (
                                        <CheckCircle size={18} />
                                    ) : (
                                        step.number
                                    )}
                                </button>
                                <span className="hidden sm:inline">{step.label}</span>
                                {idx < STEPS.length - 1 && <div className={`h-[2px] w-12 mx-2 ${currentStep > step.number ? 'bg-orange-500' : 'bg-gray-300'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">

                    {currentStep === 1 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-serif font-bold">Shopping cart ({cart.length} Item)</h2>
                                <span className="font-bold">Total ₹{totalAmount}</span>
                            </div>

                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-100 py-4 last:border-0">
                                    <img src={item.image_url} alt={item.title} loading="lazy" className="w-24 h-32 object-cover rounded shadow-sm" />
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-lg font-bold">₹{item.price}</span>
                                            {item.original_price && item.original_price > item.price && (
                                                <>
                                                    <span className="text-sm text-gray-400 line-through">₹{Math.round(item.original_price)}</span>
                                                    <span className="text-xs text-green-600 font-bold">
                                                        {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50"
                                            >
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                                            </select>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {cart.length === 0 && <div className="text-center py-10 text-gray-500">Cart is empty</div>}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-serif font-bold mb-2">Delivery Details</h2>
                            {!user && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Guest Checkout:</strong> You can order without creating an account! 
                                        {' '}<a href="/login" className="underline hover:text-blue-900">Or sign in</a> to track orders easily.
                                    </p>
                                </div>
                            )}
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <FormInput
                                        id="name"
                                        name="name"
                                        label="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                        maxLength="50"
                                        placeholder="Enter Full Name"
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        id="phone"
                                        name="phone"
                                        label="Mobile Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                        required
                                        maxLength="15"
                                        placeholder="+91 0000000000"
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        maxLength="100"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <FormInput
                                        id="address"
                                        name="address"
                                        label="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={errors.address}
                                        required
                                        maxLength="200"
                                        placeholder="Flat No, Street, Area"
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        id="pincode"
                                        name="pincode"
                                        label="Pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        error={errors.pincode}
                                        required                                        maxLength="6"                                        placeholder="000000"
                                        maxLength="6"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City *</label>
                                    <input name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded focus:ring-1 focus:ring-red-400 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State *</label>
                                    <select name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded focus:ring-1 focus:ring-red-400 outline-none bg-white">
                                        <option>Tamil Nadu</option>
                                        <option>Karnataka</option>
                                        <option>Kerala</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-serif font-bold mb-4">Payment Method</h2>
                            <div className="border border-green-200 bg-green-50 p-4 rounded flex items-center gap-3">
                                <CheckCircle className="text-green-600" size={24} />
                                <div>
                                    <p className="font-bold text-gray-800">Cash on Delivery (COD)</p>
                                    <p className="text-xs text-gray-500">Pay when the order arrives.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <div>
                    <PriceDetails />
                </div>

            </div>
        </div>
    )
}
