// Design System Constants

// Colors
export const COLORS = {
  primary: {
    main: 'orange-500',
    hover: 'orange-600',
    light: 'orange-50',
    dark: 'orange-700',
  },
  secondary: {
    main: 'pink-500',
    hover: 'pink-600',
    light: 'pink-50',
  },
  success: 'green-600',
  error: 'red-600',
  warning: 'amber-500',
  info: 'blue-500',
}

// Spacing
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
}

// Border Radius
export const RADIUS = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
}

// Shadows
export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

// Typography
export const FONTS = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

export const FONT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

export const FONT_WEIGHTS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

// Transitions
export const TRANSITIONS = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-300',
  slow: 'transition-all duration-500',
}

// Z-Index
export const Z_INDEX = {
  dropdown: 50,
  sticky: 40,
  modal: 60,
  tooltip: 70,
}

// Breakpoints (for reference)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Application Constants
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 12,
  CURRENCY_SYMBOL: '₹',
  CURRENCY_CODE: 'INR',
  MAX_CART_QUANTITY: 10,
  FREE_DELIVERY_THRESHOLD: 499,
}

export const CATEGORIES = ['All', 'Self Development', 'Finance']

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'author', label: 'Author (A-Z)' },
]

export const PROMO_CODES = {
  'SAVE10': { discount: 0.10, label: 'Save 10%' },
  'BOOKS20': { discount: 0.20, label: 'Save 20%' },
  'FIRST25': { discount: 0.25, label: 'Save 25%' },
}

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCT_DETAILS: '/product/:id',
  COLLECTIONS: '/collections',
  WISHLIST: '/wishlist',
  ACCOUNT: '/account',
  LOGIN: '/login',
  CHECKOUT: '/checkout',
  SUCCESS: '/success',
}
