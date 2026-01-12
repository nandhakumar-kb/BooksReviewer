import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { Mail, Lock, Loader, KeyRound } from 'lucide-react'

export default function Login() {
    const { signIn, signUp, resetPassword } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const [isSignUp, setIsSignUp] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Handle forgot password
        if (isForgotPassword) {
            try {
                const { error } = await resetPassword(email)
                if (error) throw error
                toast.success('Password reset link sent to your email!')
                setIsForgotPassword(false)
                setEmail('')
            } catch (err) {
                setError(err.message)
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
            return
        }

        // Validate password strength for signup
        if (isSignUp) {
            if (password.length < 8) {
                setError('Password must be at least 8 characters')
                setLoading(false)
                return
            }
            if (!/[A-Z]/.test(password)) {
                setError('Password must contain at least one uppercase letter')
                setLoading(false)
                return
            }
            if (!/[0-9]/.test(password)) {
                setError('Password must contain at least one number')
                setLoading(false)
                return
            }
        }

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password)
                if (error) throw error
                toast.success('Check your email for the confirmation link!')
                setIsSignUp(false)
            } else {
                const { error } = await signIn(email, password)
                if (error) throw error
                toast.success('Welcome back!')
                navigate('/account')
            }
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <SEO
                title={isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Login'}
                description="Sign in to your Books Reviewer account to access your orders and manage your profile."
            />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">
                    {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {isForgotPassword 
                        ? 'Enter your email to receive a password reset link' 
                        : isSignUp 
                        ? 'Join our community of readers' 
                        : 'Sign in to access your orders'}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all"
                                placeholder="name@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {!isForgotPassword && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength="8"
                                    disabled={loading}
                                />
                            </div>
                            {isSignUp && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Password must be at least 8 characters with uppercase and number
                                </p>
                            )}
                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(true)}
                                    className="mt-2 text-xs text-orange-600 hover:text-orange-700 hover:underline font-semibold"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader className="animate-spin" size={20} />}
                        {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isForgotPassword ? (
                        <button
                            onClick={() => {
                                setIsForgotPassword(false)
                                setError('')
                            }}
                            className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                        >
                            Back to Sign In
                        </button>
                    ) : (
                        <>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp)
                                    setError('')
                                }}
                                className="ml-2 font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
