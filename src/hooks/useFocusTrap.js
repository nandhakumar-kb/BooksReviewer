import { useEffect, useRef } from 'react'

export default function useFocusTrap(isActive) {
    const containerRef = useRef(null)
    const previousFocusRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const container = containerRef.current
        if (!container) return

        // Store currently focused element
        previousFocusRef.current = document.activeElement

        // Get all focusable elements
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        // Focus first element
        firstElement?.focus()

        const handleTab = (e) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        container.addEventListener('keydown', handleTab)

        return () => {
            container.removeEventListener('keydown', handleTab)
            // Restore focus
            previousFocusRef.current?.focus()
        }
    }, [isActive])

    return containerRef
}
