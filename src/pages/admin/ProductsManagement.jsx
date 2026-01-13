import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/AdminLayout'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw,
  BookOpen,
  X,
  Upload,
  Save
} from 'lucide-react'

export default function ProductsManagement() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    original_price: '',
    category: 'Self Development',
    image_url: '',
    description: '',
    in_stock: true
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.show('Failed to load books', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.author || !formData.price) {
      toast.show('Please fill in all required fields', 'error')
      return
    }

    try {
      if (editingBook) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update({
            ...formData,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null
          })
          .eq('id', editingBook.id)

        if (error) throw error
        toast.show('Book updated successfully', 'success')
      } else {
        // Create new book
        const { error } = await supabase
          .from('books')
          .insert([{
            ...formData,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null
          }])

        if (error) throw error
        toast.show('Book added successfully', 'success')
      }

      fetchBooks()
      closeModal()
    } catch (error) {
      console.error('Error saving book:', error)
      toast.show('Failed to save book', 'error')
    }
  }

  const deleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)

      if (error) throw error

      setBooks(books.filter(book => book.id !== bookId))
      toast.show('Book deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.show('Failed to delete book', 'error')
    }
  }

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book)
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price,
        original_price: book.original_price || '',
        category: book.category,
        image_url: book.image_url || '',
        description: book.description || '',
        in_stock: book.in_stock
      })
    } else {
      setEditingBook(null)
      setFormData({
        title: '',
        author: '',
        price: '',
        original_price: '',
        category: 'Self Development',
        image_url: '',
        description: '',
        in_stock: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBook(null)
    setFormData({
      title: '',
      author: '',
      price: '',
      original_price: '',
      category: 'Self Development',
      image_url: '',
      description: '',
      in_stock: true
    })
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const BookModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="299"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="499"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Self Development">Self Development</option>
              <option value="Finance">Finance</option>
              <option value="Leadership">Leadership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Book description..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="in_stock"
              checked={formData.in_stock}
              onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="in_stock" className="text-sm font-medium text-gray-700">
              In Stock
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your book inventory</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchBooks}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button
              onClick={() => openModal()}
              className="flex-1 sm:flex-none bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus size={18} /> Add Book
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Categories</option>
            <option value="Self Development">Self Development</option>
            <option value="Finance">Finance</option>
            <option value="Leadership">Leadership</option>
          </select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-base sm:text-lg">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="text-gray-400" size={48} />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-orange-600">₹{book.price}</span>
                    {book.original_price && (
                      <span className="text-sm text-gray-500 line-through">₹{book.original_price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${book.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {book.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(book)}
                      className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 font-semibold text-sm flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 font-semibold text-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && <BookModal />}
        </div>
      </div>
    </AdminLayout>
  )
}
