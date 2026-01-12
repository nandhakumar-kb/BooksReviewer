import { Plus, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function BookCard({ book }) {
    const { addToCart, setIsCartOpen } = useCart()
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const toast = useToast()
    const inWishlist = isInWishlist(book.id)
    const [imageLoaded, setImageLoaded] = useState(false)

    const toggleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (inWishlist) {
            removeFromWishlist(book.id)
            toast.info('Removed from wishlist')
        } else {
            addToWishlist(book)
            toast.success('Added to wishlist')
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        if (book.in_stock) {
            addToCart(book)
            toast.success(`${book.title} added to cart`)
            // Auto-open cart drawer after 300ms
            setTimeout(() => setIsCartOpen(true), 300)
        }
    }

    return (
        <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group" aria-label={`${book.title} by ${book.author}`}>
            <Link to={`/product/${book.id}`} className="relative aspect-[2/3] overflow-hidden bg-gray-100 block" aria-label={`View details for ${book.title}`}>
                {/* Loading placeholder */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-300">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}
                <img
                    src={book.image_url}
                    alt={`${book.title} by ${book.author}`}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.src = '/placeholder-book.png'
                        setImageLoaded(true)
                    }}
                    className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Wishlist Heart */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                    aria-label={inWishlist ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart
                        size={18}
                        className={`transition-colors ${inWishlist
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-gray-400 hover:text-pink-500'
                            }`}
                        aria-hidden="true"
                    />
                </button>

                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-800 rounded-md shadow-sm">
                        {book.category}
                    </span>
                </div>
                {!book.in_stock && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center" aria-live="polite">
                        <span className="px-4 py-2 bg-gray-900/90 text-white text-sm font-bold rounded-lg shadow-lg">Out of Stock</span>
                    </div>
                )}
            </Link>

            <div className="p-4 flex-1 flex flex-col">
                <Link to={`/product/${book.id}`} className="group-hover:text-orange-600 transition-colors">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3 font-medium line-clamp-1">{book.author}</p>

                <div className="mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                                ₹{Number(book.price).toFixed(0)}
                            </span>
                        </div>
                        {book.in_stock && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full" aria-label="In stock">
                                In Stock
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                        disabled={!book.in_stock}
                        aria-label={`Add ${book.title} to cart`}
                    >
                        <Plus size={16} aria-hidden="true" />
                        {book.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </article>
    )
}
