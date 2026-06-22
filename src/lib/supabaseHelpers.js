// Mock Helpers for frontend-only mode

export const signUp = async () => ({})
export const signIn = async () => ({})
export const signOut = async () => {}
export const getCurrentUser = async () => null
export const resetPassword = async () => {}

export const getUserProfile = async () => null
export const updateUserProfile = async () => null

export const getWishlist = async () => []
export const addToWishlist = async () => null
export const removeFromWishlist = async () => {}
export const isInWishlist = async () => false

export const getBookReviews = async () => []
export const addReview = async () => null
export const updateReview = async () => null
export const deleteReview = async () => {}
export const getUserReviewForBook = async () => null

export const getCart = async () => []
export const addToCart = async () => null
export const updateCartQuantity = async () => null
export const removeFromCart = async () => {}
export const clearCart = async () => {}

export const getUserOrders = async () => []
export const createOrder = async () => null

export const validatePromoCode = async () => { throw new Error('Promo codes disabled') }

export const getBooksWithRatings = async () => []
export const getBookWithRatings = async () => null
