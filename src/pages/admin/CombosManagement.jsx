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
  Package,
  X,
  Save,
  BookOpen
} from 'lucide-react'

export default function CombosManagement() {
  const [combos, setCombos] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCombo, setEditingCombo] = useState(null)
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    book_ids: [],
    price: '',
    original_price: '',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch combos
      const { data: combosData, error: combosError } = await supabase
        .from('combos')
        .select('*')
        .order('created_at', { ascending: false })

      if (combosError) throw combosError

      // Fetch books for selection
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, price')
        .eq('in_stock', true)

      if (booksError) throw booksError

      setCombos(combosData || [])
      setBooks(booksData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.show('Failed to load combos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.price || formData.book_ids.length === 0) {
      toast.show('Please fill in all required fields and select at least one book', 'error')
      return
    }

    try {
      const comboData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null
      }

      if (editingCombo) {
        // Update existing combo
        const { error } = await supabase
          .from('combos')
          .update(comboData)
          .eq('id', editingCombo.id)

        if (error) throw error
        toast.show('Combo updated successfully', 'success')
      } else {
        // Create new combo
        const { error } = await supabase
          .from('combos')
          .insert([comboData])

        if (error) throw error
        toast.show('Combo added successfully', 'success')
      }

      fetchData()
      closeModal()
    } catch (error) {
      console.error('Error saving combo:', error)
      toast.show('Failed to save combo', 'error')
    }
  }

  const deleteCombo = async (comboId) => {
    if (!confirm('Are you sure you want to delete this combo?')) return

    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', comboId)

      if (error) throw error

      setCombos(combos.filter(combo => combo.id !== comboId))
      toast.show('Combo deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting combo:', error)
      toast.show('Failed to delete combo', 'error')
    }
  }

  const openModal = (combo = null) => {
    if (combo) {
      setEditingCombo(combo)
      setFormData({
        title: combo.title,
        description: combo.description || '',
        book_ids: combo.book_ids || [],
        price: combo.price,
        original_price: combo.original_price || '',
        image_url: combo.image_url || '',
        is_active: combo.is_active
      })
    } else {
      setEditingCombo(null)
      setFormData({
        title: '',
        description: '',
        book_ids: [],
        price: '',
        original_price: '',
        image_url: '',
        is_active: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCombo(null)
  }

  const toggleBookSelection = (bookId) => {
    setFormData(prev => ({
      ...prev,
      book_ids: prev.book_ids.includes(bookId)
        ? prev.book_ids.filter(id => id !== bookId)
        : [...prev.book_ids, bookId]
    }))
  }

  const filteredCombos = combos.filter(combo =>
    combo.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSelectedBooks = (bookIds) => {
    return books.filter(book => bookIds.includes(book.id))
  }

  const ComboModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingCombo ? 'Edit Combo' : 'Add New Combo'}
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Combo Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Finance Mastery Combo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Describe this combo..."
            />
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
                placeholder="899"
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
                placeholder="1299"
              />
            </div>
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
              placeholder="https://example.com/combo-image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Books <span className="text-red-500">*</span> ({formData.book_ids.length} selected)
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
              {books.length === 0 ? (
                <p className="text-gray-500 text-sm">No books available</p>
              ) : (
                books.map((book) => (
                  <label
                    key={book.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      formData.book_ids.includes(book.id) ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.book_ids.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author} • ₹{book.price}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (Show on website)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingCombo ? 'Update Combo' : 'Add Combo'}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Combos Management</h1>
            <p className="text-gray-600">Manage book combo packages</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold flex items-center gap-2"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button
              onClick={() => openModal()}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2"
            >
              <Plus size={18} /> Add Combo
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search combos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Combos Grid */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredCombos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No combos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCombos.map((combo) => {
              const selectedBooks = getSelectedBooks(combo.book_ids)
              return (
                <div key={combo.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center overflow-hidden">
                    {combo.image_url ? (
                      <img
                        src={combo.image_url}
                        alt={combo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="text-white" size={64} />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-gray-900">{combo.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${combo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {combo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {combo.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{combo.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-600">₹{combo.price}</span>
                      {combo.original_price && (
                        <span className="text-sm text-gray-500 line-through">₹{combo.original_price}</span>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">INCLUDES {selectedBooks.length} BOOKS:</p>
                      <div className="space-y-1">
                        {selectedBooks.map((book) => (
                          <div key={book.id} className="flex items-center gap-2 text-sm">
                            <BookOpen size={14} className="text-orange-500" />
                            <span className="text-gray-700">{book.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(combo)}
                        className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => deleteCombo(combo.id)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 font-semibold text-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && <ComboModal />}
        </div>
      </div>
    </AdminLayout>
  )
}
