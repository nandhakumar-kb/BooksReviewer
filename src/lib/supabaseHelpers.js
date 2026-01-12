import { supabase } from './supabaseClient'

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user
 */
export const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })
    
    if (error) throw error
    return data
}

/**
 * Sign in existing user
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    
    if (error) throw error
    return data
}

/**
 * Sign out current user
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

/**
 * Reset password
 */
export const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
}

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
    
    if (error) throw error
    return data
}

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
    
    if (error) throw error
    return data
}

// ============================================================================
// WISHLIST FUNCTIONS
// ============================================================================

/**
 * Get user's wishlist
 */
export const getWishlist = async (userId) => {
    const { data, error } = await supabase
        .rpc('get_user_wishlist', { user_id_param: userId })
    
    if (error) throw error
    return data || []
}

/**
 * Add book to wishlist
 */
export const addToWishlist = async (userId, bookId) => {
    const { data, error } = await supabase
        .from('wishlists')
        .insert([{ user_id: userId, book_id: bookId }])
        .select()
    
    if (error) throw error
    return data
}

/**
 * Remove book from wishlist
 */
export const removeFromWishlist = async (userId, bookId) => {
    const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId)
    
    if (error) throw error
}

/**
 * Check if book is in wishlist
 */
export const isInWishlist = async (userId, bookId) => {
    const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
}

// ============================================================================
// REVIEW FUNCTIONS
// ============================================================================

/**
 * Get reviews for a book
 */
export const getBookReviews = async (bookId) => {
    const { data, error } = await supabase
        .rpc('get_book_reviews', { book_id_param: bookId })
    
    if (error) throw error
    return data || []
}

/**
 * Add a review
 */
export const addReview = async (userId, bookId, rating, comment) => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([{
            user_id: userId,
            book_id: bookId,
            rating,
            comment
        }])
        .select()
    
    if (error) throw error
    return data
}

/**
 * Update a review
 */
export const updateReview = async (reviewId, rating, comment) => {
    const { data, error } = await supabase
        .from('reviews')
        .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
    
    if (error) throw error
    return data
}

/**
 * Delete a review
 */
export const deleteReview = async (reviewId) => {
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
    
    if (error) throw error
}

/**
 * Get user's review for a book
 */
export const getUserReviewForBook = async (userId, bookId) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
}

// ============================================================================
// CART FUNCTIONS (Persistent Cart)
// ============================================================================

/**
 * Get user's cart
 */
export const getCart = async (userId) => {
    const { data, error } = await supabase
        .from('carts')
        .select(`
            *,
            books (*)
        `)
        .eq('user_id', userId)
    
    if (error) throw error
    return data || []
}

/**
 * Add item to cart
 */
export const addToCart = async (userId, bookId, quantity = 1) => {
    // Check if item already exists
    const { data: existing } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single()
    
    if (existing) {
        // Update quantity
        const { data, error } = await supabase
            .from('carts')
            .update({
                quantity: existing.quantity + quantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
        
        if (error) throw error
        return data
    } else {
        // Insert new item
        const { data, error } = await supabase
            .from('carts')
            .insert([{
                user_id: userId,
                book_id: bookId,
                quantity
            }])
            .select()
        
        if (error) throw error
        return data
    }
}

/**
 * Update cart item quantity
 */
export const updateCartQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
        // Remove item if quantity is 0
        return await removeFromCart(cartItemId)
    }
    
    const { data, error } = await supabase
        .from('carts')
        .update({
            quantity,
            updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select()
    
    if (error) throw error
    return data
}

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', cartItemId)
    
    if (error) throw error
}

/**
 * Clear entire cart
 */
export const clearCart = async (userId) => {
    const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', userId)
    
    if (error) throw error
}

// ============================================================================
// ORDER FUNCTIONS
// ============================================================================

/**
 * Get user's orders
 */
export const getUserOrders = async (userId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
}

/**
 * Create an order
 */
export const createOrder = async (orderData) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
    
    if (error) throw error
    return data
}

// ============================================================================
// PROMO CODE FUNCTIONS
// ============================================================================

/**
 * Validate and get promo code
 */
export const validatePromoCode = async (code) => {
    const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single()
    
    if (error) {
        if (error.code === 'PGRST116') {
            throw new Error('Invalid promo code')
        }
        throw error
    }
    
    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Promo code has expired')
    }
    
    // Check usage limit
    if (data.usage_limit && data.times_used >= data.usage_limit) {
        throw new Error('Promo code usage limit reached')
    }
    
    return data
}

// ============================================================================
// BOOK FUNCTIONS (with ratings)
// ============================================================================

/**
 * Get books with ratings
 */
export const getBooksWithRatings = async () => {
    const { data, error } = await supabase
        .from('books_with_ratings')
        .select('*')
    
    if (error) throw error
    return data || []
}

/**
 * Get single book with ratings
 */
export const getBookWithRatings = async (bookId) => {
    const { data, error } = await supabase
        .from('books_with_ratings')
        .select('*')
        .eq('id', bookId)
        .single()
    
    if (error) throw error
    return data
}
