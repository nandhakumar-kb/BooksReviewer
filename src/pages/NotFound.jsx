import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { Home, BookOpen } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
            <SEO
                title="404 - Page Not Found"
                description="The page you're looking for doesn't exist."
            />
            
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                    <p className="text-gray-600">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <Link
                        to="/collections"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors"
                    >
                        <BookOpen size={20} />
                        Browse Books
                    </Link>
                </div>
            </div>
        </div>
    )
}
