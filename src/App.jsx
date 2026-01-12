import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { Loader } from 'lucide-react'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Collections = lazy(() => import('./pages/Collections'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Account = lazy(() => import('./pages/Account'))
const Login = lazy(() => import('./pages/Login'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const Success = lazy(() => import('./pages/Success'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <div className="flex flex-col min-h-screen bg-white text-gray-900">
                  {/* Skip to main content link for accessibility */}
                  <a 
                    href="#main-content" 
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-orange-500 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg"
                  >
                    Skip to main content
                  </a>
                  <Navbar />
                  <CartDrawer />
                  <ScrollToTop />
                  <main id="main-content" className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
