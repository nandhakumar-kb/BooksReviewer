// Input sanitization utility
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .slice(0, 500) // Limit length
}

export const sanitizeEmail = (email) => {
    const cleaned = sanitizeInput(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(cleaned) ? cleaned : ''
}

export const sanitizePhone = (phone) => {
    return phone.replace(/[^\d+\-\s()]/g, '').slice(0, 20)
}

export const sanitizeNumber = (num, min = 0, max = 999999) => {
    const parsed = parseInt(num, 10)
    if (isNaN(parsed)) return min
    return Math.max(min, Math.min(max, parsed))
}
