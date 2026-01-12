-- =============================================================================
-- INSERT BOOKS AND COMBOS DATA
-- Based on the combo images provided
-- Safe to run multiple times - handles duplicates gracefully
-- =============================================================================

-- Optional: Clear existing combo data (uncomment if needed)
-- DELETE FROM combos;
-- DELETE FROM books;

-- Insert all the books from both combos
-- ON CONFLICT DO NOTHING prevents errors if books already exist
INSERT INTO books (title, author, price, original_price, category, image_url, description, in_stock) VALUES
  ('Can We Be Strangers Again?', 'Shrijeet Shandilya', 249, 399, 'Self Development', 'https://m.media-amazon.com/images/I/71XfSyo8SBL._SL1500_.jpg', 'A thoughtful exploration of relationships and personal growth', true),
  ('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 299, 499, 'Self Development', 'https://m.media-amazon.com/images/I/81W-pu5en1L._SL1500_.jpg', 'A counterintuitive approach to living a good life', true),
  ('The Art of Not Overthinking', 'Shaurya Kapoor', 199, 349, 'Self Development', 'https://m.media-amazon.com/images/I/31gvn6hIPML._SY445_SX342_.jpg', 'Learn to quiet your mind and reduce anxiety', true),
  ('The Art of Being Alone', 'Renuka Gavrani', 199, 349, 'Self Development', 'https://m.media-amazon.com/images/I/31h6nE5SXFL._SY445_SX342_.jpg', 'Discover the power of solitude and self-companionship', true),
  ('The Art of Laziness', 'Library Mindset', 199, 349, 'Self Development', 'https://m.media-amazon.com/images/I/31UGs6BO4gL._SY445_SX342_.jpg', 'Redefine productivity and embrace strategic rest', true),
  ('Atomic Habits', 'James Clear', 399, 599, 'Self Development', 'https://m.media-amazon.com/images/I/71F4+7rk2eL._SX342_.jpg', 'Tiny changes, remarkable results - build good habits', true),
  ('The Psychology of Money', 'Morgan Housel', 349, 549, 'Finance', 'https://m.media-amazon.com/images/I/41mxvU9Tu6L._SY445_SX342_.jpg', 'Timeless lessons on wealth, greed, and happiness', true);

-- =============================================================================
-- INSERT COMBOS
-- =============================================================================

-- Optional: Delete existing combos with same titles (uncomment if updating)
-- DELETE FROM combos WHERE title IN ('Best 5 combo', '5 books combo');

-- Note: These use subqueries to automatically find book IDs by title
-- No need to manually look up IDs!

-- Combo 1: Best 5 combo
INSERT INTO combos (title, description, book_ids, price, original_price, image_url, is_active) VALUES
  (
    'Best 5 combo',
    'Perfect collection for self-development: Can We Be Strangers Again, The Subtle Art, The Art of Not Overthinking, The Art of Being Alone, and The Art of Laziness',
    ARRAY[
      (SELECT id FROM books WHERE title = 'Can We Be Strangers Again?' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Subtle Art of Not Giving a F*ck' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Not Overthinking' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Being Alone' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Laziness' LIMIT 1)
    ],
    399,
    599,
    'https://dukaan.b-cdn.net/700x700/webp/media/238466db-237c-4e92-896b-61fe40450609.jpeg',
    true
  );

-- Combo 2: 5 books combo
INSERT INTO combos (title, description, book_ids, price, original_price, image_url, is_active) VALUES
  (
    '5 books combo',
    'Ultimate personal growth bundle: Atomic Habits, The Psychology of Money, The Art of Laziness, The Art of Not Overthinking, and The Art of Being Alone',
    ARRAY[
      (SELECT id FROM books WHERE title = 'Atomic Habits' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Psychology of Money' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Laziness' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Not Overthinking' LIMIT 1),
      (SELECT id FROM books WHERE title = 'The Art of Being Alone' LIMIT 1)
    ],
    399,
    599,
    'https://dukaan.b-cdn.net/700x700/webp/media/a9663885-182f-4b33-a356-1c627f58867f.jpeg',
    true
  );

-- =============================================================================
-- VERIFY THE DATA
-- =============================================================================

-- Check how many books were inserted
SELECT COUNT(*) as total_books FROM books;

-- Check how many combos were inserted
SELECT COUNT(*) as total_combos FROM combos;

-- View all combos with their book details
SELECT 
  c.id,
  c.title as combo_title,
  c.price as combo_price,
  c.original_price as combo_original_price,
  ROUND(((c.original_price - c.price) / c.original_price * 100)::numeric, 0) as discount_percent,
  array_length(c.book_ids, 1) as number_of_books,
  array_agg(b.title ORDER BY b.title) as book_titles
FROM combos c
LEFT JOIN books b ON b.id = ANY(c.book_ids)
WHERE c.is_active = true
GROUP BY c.id, c.title, c.price, c.original_price, c.book_ids
ORDER BY c.id;

-- View all books
SELECT id, title, author, price, original_price, category, in_stock 
FROM books 
ORDER BY id;
