import { useState, useEffect } from 'react'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp, Send, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function Footer() {
    const [showScroll, setShowScroll] = useState(false)
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)
    const toast = useToast()

    const handleNewsletterSubmit = (e) => {
        e.preventDefault()
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email')
            return
        }
        // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
        setSubscribed(true)
        toast.success('Thanks for subscribing!')
        setTimeout(() => {
            setEmail('')
            setSubscribed(false)
        }, 3000)
    }

    // Handle Scroll Visibility
    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true)
            } else {
                setShowScroll(false)
            }
        }
        window.addEventListener('scroll', checkScroll)
        return () => window.removeEventListener('scroll', checkScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-slate-50 text-slate-900 mt-auto border-t border-slate-200 relative">
            {/* Scroll To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 z-50 transform ${showScroll ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} />
            </button>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">

                    {/* Brand & Newsletter Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20">
                                <BookOpen size={26} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">Books Reviewer</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Transform your life, one page at a time. Join our community of readers.
                        </p>

                        {/* Newsletter Input */}
                        <form onSubmit={handleNewsletterSubmit} className="relative max-w-xs">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={subscribed}
                                className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                            <button 
                                type="submit"
                                disabled={subscribed}
                                className="absolute right-1.5 top-1.5 p-1.5 bg-orange-500 hover:bg-orange-600 rounded-md text-white transition-colors disabled:bg-green-500 disabled:cursor-not-allowed"
                            >
                                {subscribed ? <Check size={16} /> : <Send size={16} />}
                            </button>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-wide border-l-4 border-orange-500 pl-3">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Collections', path: '/collections' },
                                { name: 'My Account', path: '/account' },
                                { name: 'Login', path: '/login' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-slate-600 hover:text-orange-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-wide border-l-4 border-orange-500 pl-3">Categories</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Self Development', path: '/?category=Self Development' },
                                { name: 'Finance', path: '/?category=Finance' },
                                { name: 'Leadership', path: '/?category=Leadership' },
                                { name: 'All Books', path: '/' }
                            ].map((category) => (
                                <li key={category.name}>
                                    <Link
                                        to={category.path}
                                        className="text-slate-600 hover:text-orange-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-wide border-l-4 border-orange-500 pl-3">Contact Us</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-sm text-slate-600 group">
                                <div className="p-2 bg-white border border-slate-100 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-all shadow-sm">
                                    <MapPin size={18} />
                                </div>
                                <span className="mt-1.5 leading-relaxed">India</span>
                            </li>
                            {/* <li className="flex items-center gap-4 text-sm text-slate-600 group">
                                <div className="p-2 bg-white border border-slate-100 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-all shadow-sm">
                                    <Phone size={18} />
                                </div>
                                <span className="group-hover:text-slate-900 transition-colors">+91 123 456 7890</span>
                            </li> */}
                            <li className="flex items-center gap-4 text-sm text-slate-600 group">
                                <div className="p-2 bg-white border border-slate-100 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-all shadow-sm">
                                    <Mail size={18} />
                                </div>
                                <span className="group-hover:text-slate-900 transition-colors">contact@booksreviewer.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-slate-500">
                            © 2026 Books Reviewer. All rights reserved.
                        </p>

                        {/* Social Media */}
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-9 h-9 bg-white border border-slate-200 hover:bg-orange-500 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            {['Privacy Policy', 'Terms of Service'].map((item) => (
                                <a key={item} href="#" className="text-slate-500 hover:text-orange-600 transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}