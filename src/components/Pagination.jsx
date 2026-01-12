import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    itemsPerPage = 12,
    totalItems = 0
}) {
    const pages = []
    const maxVisible = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <nav aria-label="Pagination navigation" className="flex flex-col items-center gap-4 mt-12">
            <div className="text-sm text-gray-600">
                Showing <span className="font-bold">{startItem}</span> to <span className="font-bold">{endItem}</span> of <span className="font-bold">{totalItems}</span> results
            </div>
            
            <div className="flex items-center gap-2" role="navigation" aria-label="Page navigation">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    aria-label="Go to previous page"
                    title="Previous page"
                >
                    <ChevronLeft size={20} />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                            aria-label="Go to page 1"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                            page === currentPage
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                        aria-label={`${page === currentPage ? 'Current page, page' : 'Go to page'} ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                            aria-label={`Go to last page, page ${totalPages}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    aria-label="Go to next page"
                    title="Next page"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </nav>
    )
}
