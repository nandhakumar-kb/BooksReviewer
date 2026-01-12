-- =============================================================================
-- INSERT BOOKS AND COMBOS DATA
-- Based on the combo images provided
-- =============================================================================

-- First, insert all the books from both combos
-- Make sure these books exist before creating combos

INSERT INTO books (title, author, price, original_price, category, image_url, description, in_stock) VALUES
  ('Can We Be Strangers Again?', 'Shrijeet Shandilya', 249, 399, 'Self Development', '/books/strangers.jpg', 'A thoughtful exploration of relationships and personal growth', true),
  ('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 299, 499, 'Self Development', '/books/subtle-art.jpg', 'A counterintuitive approach to living a good life', true),
  ('The Art of Not Overthinking', 'Shaurya Kapoor', 199, 349, 'Self Development', '/books/not-overthinking.jpg', 'Learn to quiet your mind and reduce anxiety', true),
  ('The Art of Being Alone', 'Renuka Gavrani', 199, 349, 'Self Development', '/books/being-alone.jpg', 'Discover the power of solitude and self-companionship', true),
  ('The Art of Laziness', 'Library Mindset', 199, 349, 'Self Development', '/books/laziness.jpg', 'Redefine productivity and embrace strategic rest', true),
  ('Atomic Habits', 'James Clear', 399, 599, 'Self Development', '/books/atomic-habits.jpg', 'Tiny changes, remarkable results - build good habits', true),
  ('The Psychology of Money', 'Morgan Housel', 349, 549, 'Finance', '/books/psychology-money.jpg', 'Timeless lessons on wealth, greed, and happiness', true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- INSERT COMBOS
-- =============================================================================

-- Note: Replace the book IDs below with actual IDs from your books table
-- You can get the IDs by running: SELECT id, title FROM books ORDER BY id;

-- Method 1: Using book IDs directly (if you know them)
-- Replace 1,2,3,4,5 with actual book IDs

-- Combo 1: Best 5 combo
INSERT INTO combos (title, description, book_ids, price, original_price, image_url, is_active) VALUES
  (
    'Best 5 combo',
    'Perfect collection for self-development: Can We Be Strangers Again, The Subtle Art, The Art of Not Overthinking, The Art of Being Alone, and The Art of Laziness',
    ARRAY[
      (SELECT id FROM books WHERE title = 'Can We Be Strangers Again?'),
      (SELECT id FROM books WHERE title = 'The Subtle Art of Not Giving a F*ck'),
      (SELECT id FROM books WHERE title = 'The Art of Not Overthinking'),
      (SELECT id FROM books WHERE title = 'The Art of Being Alone'),
      (SELECT id FROM books WHERE title = 'The Art of Laziness')
    ],
    399,
    599,
    '/combos/best-5-combo.jpg',
    true
  );

-- Combo 2: 5 books combo
INSERT INTO combos (title, description, book_ids, price, original_price, image_url, is_active) VALUES
  (
    '5 books combo',
    'Ultimate personal growth bundle: Atomic Habits, The Psychology of Money, The Art of Laziness, The Art of Not Overthinking, and The Art of Being Alone',
    ARRAY[
      (SELECT id FROM books WHERE title = 'Atomic Habits'),
      (SELECT id FROM books WHERE title = 'The Psychology of Money'),
      (SELECT id FROM books WHERE title = 'The Art of Laziness'),
      (SELECT id FROM books WHERE title = 'The Art of Not Overthinking'),
      (SELECT id FROM books WHERE title = 'The Art of Being Alone')
    ],
    399,
    599,
    '/combos/5-books-combo.jpg',
    true
  );

-- =============================================================================
-- VERIFY THE DATA
-- =============================================================================

-- Run this to see all combos with their books:
SELECT 
  c.id,
  c.title,
  c.price,
  c.original_price,
  c.book_ids,
  array_agg(b.title) as book_titles
FROM combos c
LEFT JOIN books b ON b.id = ANY(c.book_ids)
GROUP BY c.id, c.title, c.price, c.original_price, c.book_ids;
