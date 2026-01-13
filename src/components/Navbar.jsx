import { ShoppingBag, BookOpen, Menu, X, Search, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback, useRef } from 'react'

export default function Navbar() {
    const { setIsCartOpen, totalItems } = useCart()
    const { wishlistCount } = useWishlist()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const searchTimeoutRef = useRef(null)

    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchQuery.trim()
        if (query) {
            // Check if user typed "admin" to navigate to admin page
            if (query.toLowerCase() === 'admin') {
                navigate('/admin')
                setSearchQuery('')
                setMobileMenuOpen(false)
            } else {
                navigate(`/?search=${encodeURIComponent(query)}`)
                setSearchQuery('')
            }
        }
    }

    // Debounced search for better UX (optional: auto-search as user types)
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value
        setSearchQuery(value)
        
        // Optional: Uncomment for live search with debounce
        // if (searchTimeoutRef.current) {
        //     clearTimeout(searchTimeoutRef.current)
        // }
        // searchTimeoutRef.current = setTimeout(() => {
        //     if (value.trim()) {
        //         navigate(`/?search=${encodeURIComponent(value.trim())}`)
        //     }
        // }, 500)
    }, [])

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-3 group" aria-label="Books Reviewer Home">
                        <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
                            <BookOpen size={22} aria-hidden="true" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block tracking-tight">
                            Books Reviewer
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-10" role="search">
                        <div className="relative w-full group">
                            <label htmlFor="search-desktop" className="sr-only">Search books</label>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" size={18} aria-hidden="true" />
                            <input
                                id="search-desktop"
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                maxLength="100"
                                placeholder="Search books..."
                                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-gray-400 text-sm shadow-sm"
                                aria-label="Search for books by title, author, or description"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-2">
                        <Link to="/collections" className="hidden lg:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors rounded-xl hover:bg-orange-50" aria-label="Browse collections">
                            Collections
                        </Link>
                        <Link to="/account" className="hidden lg:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors rounded-xl hover:bg-orange-50" aria-label="My account">
                            Account
                        </Link>

                        {/* Wishlist */}
                        <div className="w-px h-6 bg-gray-200 mx-2 hidden lg:block" aria-hidden="true"></div>

                        <Link
                            to="/wishlist"
                            className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}
                            title="Wishlist"
                        >
                            <Heart size={22} className="transition-transform group-hover:scale-110" aria-hidden="true" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white" aria-label={`${wishlistCount} items in wishlist`}>
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                            aria-label={`Shopping cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
                            title="Shopping cart"
                        >
                            <ShoppingBag size={22} className="transition-transform group-hover:scale-110" aria-hidden="true" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white" aria-label={`${totalItems} items in cart`}>
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div id="mobile-menu" className="lg:hidden py-4 border-t border-gray-100 animate-slide-in-down">
                        <form onSubmit={handleSearch} className="mb-4" role="search">
                            <label htmlFor="search-mobile" className="sr-only">Search books</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} aria-hidden="true" />
                                <input
                                    id="search-mobile"
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    maxLength="100"
                                    placeholder="Search books..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
                                    aria-label="Search for books by title, author, or description"
                                />
                            </div>
                        </form>
                        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-3">
                                Home
                            </Link>
                            <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-3">
                                Collections
                            </Link>
                            <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-3">
                                Account
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </nav>
    )
}
