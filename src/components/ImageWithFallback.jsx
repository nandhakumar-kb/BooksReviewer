import { useState } from 'react'

export default function ImageWithFallback({ src, alt, className, fallbackSrc = '/placeholder-book.png', loading = 'lazy' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleError = (e) => {
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc
      setError(true)
    }
  }

  const handleLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div className="relative w-full h-full">
      {/* Skeleton loader */}
      {!imageLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
