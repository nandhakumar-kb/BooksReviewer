import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Loader } from 'lucide-react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

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
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/account`
            }
        })
        
        // Return success even if email confirmation is required
        return { data, error }
    }

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password })
    }

    const signOut = () => {
        return supabase.auth.signOut()
    }

    const resetPassword = (email) => {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
    }

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut, resetPassword, loading }}>
            {loading ? <AuthLoader /> : children}
        </AuthContext.Provider>
    )
}
