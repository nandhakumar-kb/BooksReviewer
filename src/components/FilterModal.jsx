import { useState, useEffect } from 'react'
import { X, Sliders } from 'lucide-react'
import useFocusTrap from '../hooks/useFocusTrap'

export default function FilterModal({ isOpen, onClose, onApply, currentFilters }) {
    const modalRef = useFocusTrap(isOpen)
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        category: 'All',
        inStock: false,
        sortBy: 'title'
    })

    useEffect(() => {
        if (currentFilters) {
            setFilters(currentFilters)
        }
    }, [currentFilters])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleApply = () => {
        onApply(filters)
        onClose()
    }

    const handleReset = () => {
        const resetFilters = {
            minPrice: '',
            maxPrice: '',
            category: 'All',
            inStock: false,
            sortBy: 'title'
        }
        setFilters(resetFilters)
        onApply(resetFilters)
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div ref={modalRef} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl m-4 animate-slide-in">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-lg">
                            <Sliders size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Advanced Filters</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Price Range</label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Min ₹"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-400 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Max ₹"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-400 outline-none bg-white"
                        >
                            <option value="All">All Categories</option>
                            <option value="Self Development">Self Development</option>
                            <option value="Finance">Finance</option>
                            <option value="Leadership">Leadership</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-400 outline-none bg-white"
                        >
                            <option value="title">Title (A-Z)</option>
                            <option value="author">Author (A-Z)</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    {/* In Stock Only */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={filters.inStock}
                            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-2 focus:ring-amber-400"
                        />
                        <label htmlFor="inStock" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Show in-stock items only
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}
