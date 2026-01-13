import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Heart, ShoppingCart, Trash2, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()
    const toast = useToast()

    const handleMoveToCart = (book) => {
        addToCart(book)
        removeFromWishlist(book.id)
        toast.success(`${book.title} moved to cart`)
    }

    const handleRemove = (book, e) => {
        e.preventDefault()
        e.stopPropagation()
        if (window.confirm(`Remove "${book.title}" from wishlist?`)) {
            removeFromWishlist(book.id)
            toast.info('Removed from wishlist')
        }
    }

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white py-8 sm:py-10 md:py-12">
            <SEO
                title="My Wishlist"
                description="Your saved books and reading list"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-xl">
                        <Heart size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">{wishlist.length} items saved</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg">
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4 sm:mb-6">
                            <Heart className="text-pink-500" size={40} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Save books you love for later!</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all text-sm sm:text-base"
                        >
                            <BookOpen size={20} />
                            Browse Books
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {wishlist.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 flex flex-col">
                                <Link to={`/product/${book.id}`} className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <img
                                        src={book.image_url}
                                        alt={book.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={(e) => handleRemove(book, e)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                                        aria-label={`Remove ${book.title} from wishlist`}
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </Link>

                                <div className="p-5 flex-1 flex flex-col">
                                    <Link to={`/product/${book.id}`}>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-amber-500 transition-colors">
                                            {book.title}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 mb-4">{book.author}</p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ₹{Number(book.price).toFixed(0)}
                                            </span>
                                            {book.original_price && book.original_price > book.price && (
                                                <>
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{Math.round(book.original_price)}
                                                    </span>
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                        {Math.round(((book.original_price - book.price) / book.original_price) * 100)}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleMoveToCart(book)}
                                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={18} />
                                            Move to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
