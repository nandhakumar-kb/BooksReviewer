import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart')
            return savedCart ? JSON.parse(savedCart) : []
        } catch {
            return []
        }
    })
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id)
            return
        }
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => setCart([])

    // Memoize expensive calculations
    const totalAmount = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    )
    
    const totalItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    )

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                totalAmount,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
