import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductCard from '../components/ProductCard'
import { MOCK_COMBOS, MOCK_BOOKS } from '../lib/mockData'
import { ArrowLeft, ShoppingBag, Loader, Truck, ShieldCheck, Package } from 'lucide-react'

export default function ComboDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, setIsCartOpen } = useCart()
    const toast = useToast()
    const [combo, setCombo] = useState(null)
    const [relatedCombos, setRelatedCombos] = useState([])
    const [includedBooks, setIncludedBooks] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchCombo = useCallback(async () => {
        try {
            setLoading(true)
            
            // Find combo from mock data
            const comboId = parseInt(id)
            const comboData = MOCK_COMBOS.find(c => c.id === comboId)
            
            if (!comboData) throw new Error("Combo not found")
            
            setCombo(comboData)

            // Find included books
            if (comboData.books) {
                const books = MOCK_BOOKS.filter(b => comboData.books.includes(b.id))
                setIncludedBooks(books)
            }

            // Find related combos (just other combos for now)
            const related = MOCK_COMBOS.filter(c => c.id !== comboId).slice(0, 4)
            setRelatedCombos(related)
        } catch (error) {
            toast.error('Failed to load combo details')
            navigate('/collections?type=combos') // Redirect on error
        } finally {
            setLoading(false)
        }
    }, [id, navigate, toast])

    useEffect(() => {
        fetchCombo()
    }, [fetchCombo])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader className="animate-spin text-purple-600 mb-4" size={48} />
                <p className="text-gray-600 font-medium">Loading combo details, please wait...</p>
            </div>
        )
    }
    
    if (!combo) return null

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Combos', href: `/collections?type=combos` },
        { label: combo.title }
    ]

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": combo.title,
        "image": combo.image_url,
        "description": combo.description,
        "offers": {
            "@type": "Offer",
            "price": combo.price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": window.location.href
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
            <SEO
                title={combo.title}
                description={combo.description || `${combo.title} - Special Book Combo`}
                image={combo.image_url}
                type="product"
                structuredData={structuredData}
            />
            <Breadcrumbs items={breadcrumbs} />
            
            <Link
                to="/collections?type=combos"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 sm:mb-6 font-semibold px-4 py-2 rounded-lg hover:bg-purple-50 transition-all group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Combos
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden shadow-sm border border-purple-100 flex items-center justify-center p-8">
                        <img
                            src={combo.image_url}
                            alt={combo.title}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                    <span className="inline-flex items-center gap-1 w-fit bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider mb-4">
                        <Package size={14} />
                        Combo Offer
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                        {combo.title}
                    </h1>

                    <div className="flex items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8 mt-4">
                        <span className="text-3xl sm:text-4xl font-bold text-purple-600">₹{combo.price}</span>
                        {combo.original_price && combo.original_price > combo.price && (
                            <>
                                <span className="text-xl text-gray-400 line-through">₹{Math.round(combo.original_price)}</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg shadow-sm">
                                    SAVE {Math.round(((combo.original_price - combo.price) / combo.original_price) * 100)}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        {combo.description}
                    </p>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => {
                                addToCart({
                                    id: `combo-${combo.id}`,
                                    title: combo.title,
                                    price: combo.price,
                                    image_url: combo.image_url,
                                    isCombo: true,
                                    comboId: combo.id,
                                    quantity: 1
                                })
                                toast.success(`${combo.title} added to cart`)
                                setTimeout(() => setIsCartOpen(true), 300)
                            }}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            <ShoppingBag size={20} />
                            Add Combo to Cart
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <Truck className="text-purple-400 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-gray-900">Free Delivery</h4>
                                <p className="text-sm text-gray-500">On all combos</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="text-purple-400 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-gray-900">Curated Bundle</h4>
                                <p className="text-sm text-gray-500">Hand-picked selection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Included Books */}
            {includedBooks.length > 0 && (
                <div className="mt-20 py-12 bg-gray-50 rounded-3xl px-6 sm:px-10">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Books Included in this Combo</h2>
                        <p className="text-gray-600 mt-2">Get these masterworks together at a discount</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-8 justify-center">
                        {includedBooks.map(book => (
                            <ProductCard key={book.id} product={book} />
                        ))}
                    </div>
                </div>
            )}

            {/* Related Combos */}
            {relatedCombos.length > 0 && (
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Other Combo Offers</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {relatedCombos.map(relatedCombo => (
                            <ProductCard key={relatedCombo.id} product={relatedCombo} isCombo={true} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
