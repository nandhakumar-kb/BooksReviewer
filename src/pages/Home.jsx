import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import BookCard from '../components/BookCard'
import ComboCard from '../components/ComboCard'
import BookCardSkeleton from '../components/BookCardSkeleton'
import EmptyState from '../components/EmptyState'
import SEO from '../components/SEO'
import HeroCarousel from '../components/HeroCarousel'
import Pagination from '../components/Pagination'
import FilterModal from '../components/FilterModal'
import { TrendingUp, BookOpen, Users, Award, ArrowRight, Sparkles, Star, ArrowUpDown, Sliders, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORIES, APP_CONFIG } from '../lib/constants'

const { ITEMS_PER_PAGE } = APP_CONFIG

const FEATURED_CATEGORIES = [
    {
        name: 'Self Development',
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        description: 'Transform yourself',
        count: '50+ Books'
    },
    {
        name: 'Finance',
        icon: TrendingUp,
        color: 'from-emerald-500 to-teal-500',
        description: 'Build wealth',
        count: '40+ Books'
    },
    {
        name: 'Leadership',
        icon: Award,
        color: 'from-amber-500 to-orange-500',
        description: 'Lead with impact',
        count: 'Coming Soon'
    }
]

export default function Home() {
    const [books, setBooks] = useState([])
    const [combos, setCombos] = useState([])
    const [loading, setLoading] = useState(true)
    const [combosLoading, setCombosLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [filters, setFilters] = useState({
        category: 'All',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sortBy: 'title'
    })
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''
    const toast = useToast()

    useEffect(() => {
        fetchBooks()
        fetchCombos()
    }, [])

    const fetchBooks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('books').select('*')
            if (error) throw error
            setBooks(data || [])
        } catch (error) {
            toast.error('Failed to load books. Please try again.')
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
                .limit(4)
            if (error) throw error
            setCombos(data || [])
        } catch (error) {
            console.error('Failed to load combos:', error)
        } finally {
            setCombosLoading(false)
        }
    }

    // Consolidated filtering and sorting logic with useMemo for performance
    const { filteredBooks, sortedBooks, paginatedBooks } = useMemo(() => {
        let result = [...books]

        // Apply category filter
        if (filters.category !== 'All') {
            result = result.filter(b => b.category === filters.category)
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.description?.toLowerCase().includes(query)
            )
        }

        // Apply price filters
        if (filters.minPrice) {
            result = result.filter(b => b.price >= parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
            result = result.filter(b => b.price <= parseFloat(filters.maxPrice))
        }

        // Apply stock filter
        if (filters.inStock) {
            result = result.filter(b => b.in_stock)
        }

        // Store filtered result
        const filtered = result

        // Apply sorting
        const sorted = [...result].sort((a, b) => {
            switch (filters.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'author':
                    return a.author.localeCompare(b.author)
                default:
                    return 0
            }
        })

        // Apply pagination
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const paginated = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE)

        return {
            filteredBooks: filtered,
            sortedBooks: sorted,
            paginatedBooks: paginated
        }
    }, [books, filters, searchQuery, currentPage])

    const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [filters.category, searchQuery, filters.sortBy])

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters)
        setFilterModalOpen(false)
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <SEO
                title="Home"
                description="Discover curated books on self-development, finance, and success. Transform your life with hand-picked titles."
            />
            {/* Hero Section with Carousel */}
            <div className="relative">
                <HeroCarousel />

                {/* Hero Content Overlay - Improved Contrast */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-center text-white px-4 max-w-5xl pointer-events-auto relative z-20">
                        <div className="inline-block mb-8 px-5 py-2 bg-orange-500/90 backdrop-blur-md rounded-full border border-orange-300/30 shadow-lg animate-fade-in-up">
                            <span className="text-sm font-bold tracking-wide uppercase text-white">📚 Welcome to Books Reviewer</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl tracking-tight leading-tight animate-fade-in-up delay-100 text-white">
                            Transform Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-200 to-orange-300 drop-shadow-lg">
                                Mindset
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up delay-200 drop-shadow-lg">
                            Hand-picked masterworks to elevate your financial intelligence and personal growth.
                        </p>
                        <div className="flex flex-wrap gap-5 justify-center animate-fade-in-up delay-300">
                            <a href="#books" className="group px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-2 transition-all duration-300 flex items-center gap-2">
                                Explore Books
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </a>
                            <Link to="/collections" className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white font-bold rounded-xl border border-white/40 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                                View Collections
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - Overlapping */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: BookOpen, label: "Curated Books", value: `${books.length}+`, color: "text-blue-500", bg: "bg-blue-50" },
                        { icon: Users, label: "Happy Readers", value: "1000+", color: "text-emerald-500", bg: "bg-emerald-50" },
                        { icon: Star, label: "Average Rating", value: "4.8/5", color: "text-amber-500", bg: "bg-amber-50" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={stat.color} size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 leading-none mb-1">{stat.value}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
                        <p className="text-gray-500 text-lg max-w-xl">Find the perfect book to match your current goals and interests.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURED_CATEGORIES.map((category, idx) => {
                        const Icon = category.icon
                        return (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${category.color} opacity-[0.03] rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700`}></div>
                                {/* Icon in colored circle */}
                                <div className="mb-6">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} opacity-10 rounded-full`}>
                                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${category.color} text-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{category.name}</h3>
                                <p className="text-gray-500 mb-6 leading-relaxed">{category.description}</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-amber-600 transition-colors">
                                    <span>Browse Books</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Book Combos Section */}
            {combos.length > 0 && (
                <div className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                                <Package className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-bold text-purple-600 uppercase tracking-wide">Special Offers</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Book Combos - Save More!
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Get curated book bundles at amazing discounts. Perfect for building your library.
                            </p>
                        </div>

                        {combosLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                {[...Array(4)].map((_, i) => (
                                    <BookCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                {combos.map((combo) => (
                                    <ComboCard key={combo.id} combo={combo} />
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link
                                to="/collections?type=combos"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                View All Combos
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Books Section */}
            <div id="books" className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        {searchQuery ? (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Search Results for "{searchQuery}"
                                </h2>
                                <p className="text-gray-500 text-lg mb-8">
                                    Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">Featured Books</h2>
                                <p className="text-gray-500 text-xl mb-10 max-w-2xl mx-auto">Hand-picked titles to accelerate your growth.</p>
                            </>
                        )}

                        {/* Category Filters */}
                        <div className="inline-flex p-1.5 bg-gray-100/80 rounded-full">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${filters.category === cat
                                        ? 'bg-white text-gray-900 shadow-md transform scale-105'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sorting and Results Count */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                        <p className="text-gray-500 text-sm font-medium">
                            {loading ? 'Loading...' : `Showing ${paginatedBooks.length} of ${sortedBooks.length} books`}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFilterModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-amber-400 hover:text-amber-600 transition-all text-sm font-semibold shadow-sm"
                            >
                                <Sliders size={16} />
                                Filters
                            </button>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-amber-400 transition-colors shadow-sm">
                                <ArrowUpDown size={16} className="text-gray-400" />
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="bg-transparent border-none outline-none text-sm font-semibold text-gray-700 cursor-pointer focus:ring-0"
                                    aria-label="Sort books by"
                                >
                                    <option value="title">Sort by Title</option>
                                    <option value="author">Sort by Author</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Books Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
                            {[...Array(8)].map((_, i) => <BookCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
                                {paginatedBooks.map(book => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>

                            {sortedBooks.length === 0 && (
                                <EmptyState
                                    icon={BookOpen}
                                    title="No books found"
                                    description={searchQuery 
                                        ? `We couldn't find any books matching "${searchQuery}". Try different keywords or browse all books.`
                                        : 'No books match your current filters. Try adjusting your search criteria.'}
                                    actionLabel={searchQuery ? "Clear Search" : "Clear Filters"}
                                    onAction={() => {
                                        if (searchQuery) {
                                            window.location.href = '/'
                                        } else {
                                            setFilters({
                                                category: 'All',
                                                minPrice: '',
                                                maxPrice: '',
                                                inStock: false,
                                                sortBy: 'title'
                                            })
                                        }
                                    }}
                                />
                            )}

                            {/* Pagination */}
                            {sortedBooks.length > ITEMS_PER_PAGE && (
                                <div className="mt-16">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        totalItems={sortedBooks.length}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CTA Section - Join Community Banner - Light Theme */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden relative py-16 px-8 border border-orange-100">
                    {/* Abstract Background patterns */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        {/* Left Column - Text Content */}
                        <div className="text-left">
                            <span className="inline-block px-4 py-1.5 bg-white text-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 border border-orange-200 shadow-sm">
                                Join the Community
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Start Your Reading<br />Journey Today
                            </h2>
                            <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-lg">
                                Join thousands of smart readers who are transforming their lives through the power of books.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/collections" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300">
                                    Browse Collections
                                    <ArrowRight size={20} />
                                </Link>
                                <Link to="/account" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 border border-slate-200 shadow-sm">
                                    Create Account
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - 3D Book Icon & Offer */}
                        <div className="relative h-80 lg:h-full min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-gray-900 p-8 relative z-10 transform hover:scale-105 transition-transform duration-500">
                                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20 rotate-6 hover:rotate-3 transition-transform">
                                    <BookOpen size={56} className="text-white" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-bold mb-3 text-slate-800">Special Offer</h3>
                                <p className="text-5xl font-black text-orange-500 mb-2">Best Deals</p>
                                <p className="text-slate-500 mt-3 font-medium text-lg">On curated book collections</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleFilterApply}
                currentFilters={filters}
            />
        </div>
    )
}
