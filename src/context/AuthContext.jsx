import { createContext, useContext, useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// Mock user for frontend-only mode
const MOCK_USER = {
    id: 'mock-user-123',
    email: 'mockuser@example.com',
    user_metadata: {
        full_name: 'Mock User'
    }
}

// Loading component
function AuthLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Loader className="animate-spin text-orange-500 mb-4 mx-auto" size={48} />
                <p className="text-gray-600 font-medium">Loading your account...</p>
            </div>
        </div>
    )
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(MOCK_USER)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Mock checking session
        setLoading(true)
        setTimeout(() => setLoading(false), 500)
    }, [])

    const signUp = async (email, password) => {
        // Return mock success
        return new Promise(resolve => setTimeout(() => resolve({ data: { user: MOCK_USER }, error: null }), 500))
    }

    const signIn = async (email, password) => {
        return new Promise(resolve => setTimeout(() => {
            setUser(MOCK_USER)
            resolve({ data: { user: MOCK_USER }, error: null })
        }, 500))
    }

    const signOut = async () => {
        return new Promise(resolve => setTimeout(() => {
            setUser(null)
            resolve({ error: null })
        }, 500))
    }

    const resetPassword = async (email) => {
        return new Promise(resolve => setTimeout(() => resolve({ error: null }), 500))
    }

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut, resetPassword, loading }}>
            {loading ? <AuthLoader /> : children}
        </AuthContext.Provider>
    )
}
