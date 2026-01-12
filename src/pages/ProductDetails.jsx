import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import BookCard from '../components/BookCard'
import { ArrowLeft, ShoppingBag, Loader, Truck, ShieldCheck } from 'lucide-react'

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, setIsCartOpen } = useCart()
    const toast = useToast()
    const [book, setBook] = useState(null)
    const [relatedBooks, setRelatedBooks] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBook = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setBook(data)

            // Fetch related books from same category
            const { data: related } = await supabase
                .from('books')
                .select('*')
                .eq('category', data.category)
                .neq('id', id)
                .limit(4)

            setRelatedBooks(related || [])
        } catch (error) {
            toast.error('Failed to load book details')
            navigate('/') // Redirect on error
        } finally {
            setLoading(false)
        }
    }, [id, navigate, toast])

    useEffect(() => {
        fetchBook()
    }, [fetchBook])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader className="animate-spin text-orange-500 mb-4" size={48} />
                <p className="text-gray-600 font-medium">Loading book details, please wait...</p>
            </div>
        )
    }
    
    if (!book) return null

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: book.category, href: `/?category=${book.category}` },
        { label: book.title }
    ]

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "author": {
            "@type": "Person",
            "name": book.author
        },
        "image": book.image_url,
        "description": book.description || `${book.title} by ${book.author}`,
        "offers": {
            "@type": "Offer",
            "price": book.price,
            "priceCurrency": "INR",
            "availability": book.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": window.location.href
        },
        "category": book.category
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <SEO
                title={book.title}
                description={book.description || `${book.title} by ${book.author}. Available now at Books Reviewer.`}
                image={book.image_url}
                type="product"
                structuredData={structuredData}
            />
            <Breadcrumbs items={breadcrumbs} />
            
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-all group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Books
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-orange-500 tracking-wider uppercase mb-2">
                        {book.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                        {book.title}
                    </h1>
                    <p className="text-lg text-gray-500 mb-6 italic">by {book.author}</p>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-3xl font-bold text-gray-900">₹{book.price}</span>
                        {book.original_price && book.original_price > book.price && (
                            <>
                                <span className="text-xl text-gray-400 line-through">₹{Math.round(book.original_price)}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                    SAVE {Math.round(((book.original_price - book.price) / book.original_price) * 100)}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {book.description || "Discover insights and strategies that can transform your mindset and approach. A valuable addition to your personal library."}
                    </p>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => {
                                addToCart(book)
                                toast.success(`${book.title} added to cart`)
                                setTimeout(() => setIsCartOpen(true), 300)
                            }}
                            disabled={!book.in_stock}
                            className="flex-1 btn-primary py-4 rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg shadow-orange-200 hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <ShoppingBag size={20} />
                            {book.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <Truck className="text-gray-400 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-sm">Free Delivery</h4>
                                <p className="text-xs text-gray-500">On all prepaid orders</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="text-gray-400 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-sm">Genuine Product</h4>
                                <p className="text-xs text-gray-500">100% Authentic sourced</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Related Products */}
            {relatedBooks.length > 0 && (
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                            <p className="text-gray-600 mt-1">More books from {book.category}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-8">
                        {relatedBooks.map(relatedBook => (
                            <BookCard key={relatedBook.id} book={relatedBook} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
