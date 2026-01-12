import { useEffect } from 'react'

export default function SEO({ 
    title = 'Books Reviewer - Transform Your Life One Page at a Time',
    description = 'Hand-picked books on self-development, finance, and success. Shop curated collections to elevate your personal growth and financial intelligence.',
    image = '/books1.jpeg',
    keywords = 'books, self development, finance, personal growth, success, reading',
    type = 'website',
    structuredData = null
}) {
    useEffect(() => {
        // Update title
        const fullTitle = title.includes('Books Reviewer') ? title : `${title} | Books Reviewer`
        document.title = fullTitle
        
        // Update or create meta tags
        const updateMetaTag = (name, content, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name'
            let element = document.querySelector(`meta[${attribute}="${name}"]`)
            
            if (!element) {
                element = document.createElement('meta')
                element.setAttribute(attribute, name)
                document.head.appendChild(element)
            }
            element.setAttribute('content', content)
        }
        
        // Standard meta tags
        updateMetaTag('description', description)
        updateMetaTag('keywords', keywords)
        
        // Open Graph tags
        updateMetaTag('og:type', type, true)
        updateMetaTag('og:title', fullTitle, true)
        updateMetaTag('og:description', description, true)
        updateMetaTag('og:image', image, true)
        updateMetaTag('og:url', window.location.href, true)
        
        // Twitter tags
        updateMetaTag('twitter:card', 'summary_large_image')
        updateMetaTag('twitter:title', fullTitle)
        updateMetaTag('twitter:description', description)
        updateMetaTag('twitter:image', image)
        
        // Add canonical URL
        let canonical = document.querySelector('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement('link')
            canonical.setAttribute('rel', 'canonical')
            document.head.appendChild(canonical)
        }
        canonical.setAttribute('href', window.location.href)
        
        // Add JSON-LD structured data
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"]')
            if (!script) {
                script = document.createElement('script')
                script.setAttribute('type', 'application/ld+json')
                document.head.appendChild(script)
            }
            script.textContent = JSON.stringify(structuredData)
        }
        
    }, [title, description, image, keywords, type, structuredData])
    
    return null
}
