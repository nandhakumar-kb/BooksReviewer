export const MOCK_BOOKS = [
    { id: 1, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 299, original_price: 499, category: 'Finance', in_stock: true, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=Rich+Dad' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 399, original_price: 599, category: 'Self Development', in_stock: true, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=Atomic+Habits' },
    { id: 3, title: 'Think and Grow Rich', author: 'Napoleon Hill', price: 249, original_price: 399, category: 'Finance', in_stock: true, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=Think+Rich' },
    { id: 4, title: 'The 5 AM Club', author: 'Robin Sharma', price: 299, original_price: 450, category: 'Self Development', in_stock: true, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=5AM+Club' },
    { id: 5, title: 'Leaders Eat Last', author: 'Simon Sinek', price: 450, original_price: 600, category: 'Leadership', in_stock: false, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=Leaders' },
    { id: 6, title: 'Deep Work', author: 'Cal Newport', price: 350, original_price: 500, category: 'Self Development', in_stock: true, image_url: 'https://placehold.co/400x600/F8FAFC/0B132B?text=Deep+Work' }
];

export const MOCK_COMBOS = [
    { id: 101, title: 'The Productivity Bundle', description: 'Master your time with Atomic Habits and Deep Work.', price: 650, original_price: 1099, image_url: 'https://placehold.co/800x600/F8FAFC/0B132B?text=Productivity+Bundle', books: [2, 6] },
    { id: 102, title: 'Wealth Starter Pack', description: 'Rich Dad Poor Dad + Think and Grow Rich to kickstart your journey.', price: 499, original_price: 898, image_url: 'https://placehold.co/800x600/F8FAFC/0B132B?text=Wealth+Pack', books: [1, 3] }
];
