import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import SEO from '../components/SEO'
import ComboCard from '../components/ComboCard'
import BookCardSkeleton from '../components/BookCardSkeleton'
import { Loader, BookOpen, TrendingUp, Award, Package } from 'lucide-react'

const COLLECTION_ICONS = {
    'Self Development': BookOpen,
    'Finance': TrendingUp,
    'Leadership': Award
}

const COLLECTION_COLORS = {
    'Self Development': 'from-purple-500 to-pink-500',
    'Finance': 'from-emerald-500 to-teal-500',
    'Leadership': 'from-amber-500 to-orange-500'
}

export default function Collections() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const viewType = searchParams.get('type') || 'categories' // 'categories' or 'combos'
    const toast = useToast()
    const [collections, setCollections] = useState([])
    const [combos, setCombos] = useState([])
    const [loading, setLoading] = useState(true)
    const [combosLoading, setCombosLoading] = useState(false)

    useEffect(() => {
        if (viewType === 'combos') {
            fetchCombos()
        } else {
            fetchCollections()
        }
    }, [viewType])

    const fetchCollections = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('books')
                .select('category')

            if (error) throw error

            // Count books per category
            const categoryCounts = data.reduce((acc, book) => {
                acc[book.category] = (acc[book.category] || 0) + 1
                return acc
            }, {})

            const collectionsData = Object.entries(categoryCounts).map(([category, count]) => ({
                id: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                count: `${count} Books`,
                icon: COLLECTION_ICONS[category] || BookOpen,
                gradient: COLLECTION_COLORS[category] || 'from-gray-500 to-gray-700'
            }))

            setCollections(collectionsData)
        } catch (error) {
            toast.error('Failed to load collections')
        } finally {
            setLoading(false)
        }
    }

    const fetchCombos = async () => {
        try {
            setCombosLoading(true)
            const { data, error } = await supabase
                .from('combos')
                .select('*')
                .eq('is_active', true)
            
            if (error) throw error
            setCombos(data || [])
        } catch (error) {
            toast.error('Failed to load combos')
        } finally {
            setCombosLoading(false)
        }
    }

    if (loading || combosLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader className="animate-spin text-amber-500 mb-4" size={48} />
                <p className="text-gray-600 font-medium">Loading {viewType === 'combos' ? 'combos' : 'collections'}...</p>
            </div>
        )
    }

    return (
        <div className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SEO
                title="Collections"
                description="Browse our curated book collections including Self Development, Finance, and Leadership categories."
            />

            {/* Toggle Tabs */}
            <div className="flex justify-center mb-6 sm:mb-8">
                <div className="inline-flex bg-white rounded-xl shadow-md p-1 border border-gray-200 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/collections?type=categories')}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                            viewType === 'categories'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <BookOpen className="w-5 h-5" />
                        Categories
                    </button>
                    <button
                        onClick={() => navigate('/collections?type=combos')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                            viewType === 'combos'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Package className="w-5 h-5" />
                        Combos
                    </button>
                </div>
            </div>

            {viewType === 'combos' ? (
                <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Book Combos
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-8 sm:mb-10 md:mb-12">
                        Curated book bundles at amazing discounts
                    </p>

                    {combos.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Combos Available</h3>
                            <p className="text-gray-500">Check back soon for exciting combo deals!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {combos.map((combo) => (
                                <ComboCard key={combo.id} combo={combo} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
                        Book Collections
                    </h1>
                    <p className="text-gray-600 text-center mb-12 text-lg">
                        Curated categories for your reading journey
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((col) => {
                            const Icon = col.icon
                            return (
                                <button
                                    key={col.id}
                                    onClick={() => navigate(`/?category=${col.name}`)}
                                    className="group relative bg-white border-2 border-gray-200 hover:border-orange-300 rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-2 duration-300 text-left focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${col.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
                                    
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${col.gradient} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10`}>
                                        <Icon size={32} strokeWidth={2.5} />
                                    </div>
                                    
                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors relative z-10">{col.name}</h3>
                                    <p className="text-gray-600 font-medium mb-6 relative z-10">{col.count}</p>
                                    
                                    {/* Arrow */}
                                    <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm relative z-10">
                                        <span>Explore Collection</span>
                                        <span className="group-hover:translate-x-2 transition-transform">→</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
            </div>
        </div>
    )
}
