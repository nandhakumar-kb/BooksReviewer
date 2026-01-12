import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CAROUSEL_IMAGES = [
    '/books1.jpeg',
    '/books2.jpeg',
    '/books3.jpeg'
]

const AUTO_ROTATE_INTERVAL = 5000 // 5 seconds

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
        }, AUTO_ROTATE_INTERVAL)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent(curr => (curr === 0 ? CAROUSEL_IMAGES.length - 1 : curr - 1))
    const next = () => setCurrent(curr => (curr + 1) % CAROUSEL_IMAGES.length)

    return (
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group">
            {CAROUSEL_IMAGES.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={img}
                        alt={`Book collection showcase ${index + 1} - Curated selection of self-development and finance books`}
                        className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {CAROUSEL_IMAGES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={idx === current ? 'true' : 'false'}
                    />
                ))}
            </div>
        </div>
    )
}
