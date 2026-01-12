import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-gray-600 hover:text-amber-500 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-bold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}
