export const MOCK_BOOKS = [
    { id: 1, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 299, original_price: 499, category: 'Finance', in_stock: true, image_url: 'https://covers.openlibrary.org/b/isbn/9781612681139-L.jpg' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 399, original_price: 599, category: 'Self Development', in_stock: true, image_url: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' },
    { id: 3, title: 'Think and Grow Rich', author: 'Napoleon Hill', price: 249, original_price: 399, category: 'Finance', in_stock: true, image_url: 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg' },
    { id: 4, title: 'The 5 AM Club', author: 'Robin Sharma', price: 299, original_price: 450, category: 'Self Development', in_stock: true, image_url: 'https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg' },
    { id: 5, title: 'Leaders Eat Last', author: 'Simon Sinek', price: 450, original_price: 600, category: 'Leadership', in_stock: false, image_url: 'https://covers.openlibrary.org/b/isbn/9781591848011-L.jpg' },
    { id: 6, title: 'Deep Work', author: 'Cal Newport', price: 350, original_price: 500, category: 'Self Development', in_stock: true, image_url: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg' }
];

export const MOCK_COMBOS = [
    { id: 101, title: 'The Productivity Bundle', description: 'Master your time with Atomic Habits and Deep Work.', price: 650, original_price: 1099, image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', books: [2, 6] },
    { id: 102, title: 'Wealth Starter Pack', description: 'Rich Dad Poor Dad + Think and Grow Rich to kickstart your journey.', price: 499, original_price: 898, image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', books: [1, 3] }
];
