import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            if (prev.find(item => item.id === product.id)) {
                return prev // Already in wishlist
            }
            return [...prev, product]
        })
    }

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id))
    }

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id)
    }

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                wishlistCount: wishlist.length
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}
