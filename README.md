# 📚 Books E-Commerce Website

A modern, full-featured online bookstore built with React, Vite, Supabase, and TailwindCSS.

## ✨ Features

- 🛒 **Shopping Cart** - Add, remove, and manage book quantities
- ❤️ **Wishlist** - Save favorite books for later
- 🔐 **User Authentication** - Sign up, login, and manage account
- 📦 **Order Management** - Complete checkout and order tracking
- 🎨 **Responsive Design** - Works on mobile, tablet, and desktop
- ⚡ **Fast Performance** - Optimized with lazy loading and code splitting
- 📧 **Email Notifications** - Order confirmations via EmailJS
- 🎯 **Product Combos** - Special bundle offers
- 🔍 **Advanced Filtering** - Filter by category, price, and stock
- 📊 **SEO Optimized** - Better search engine visibility

## 🚀 Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** TailwindCSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Email:** EmailJS
- **Routing:** React Router
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/books-ecommerce.git
   cd books-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update with your Supabase and EmailJS credentials

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Set up database:**
   - Create a Supabase project at https://supabase.com
   - Run the SQL schema from `supabase_schema.sql` in SQL Editor
   - (Optional) Insert sample data from `insert_combos_data.sql`

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   ```
   http://localhost:5173
   ```

## 🗄️ Database Schema

The application uses the following tables:
- **books** - Product catalog
- **combos** - Bundle offers
- **orders** - Customer orders
- **profiles** - User profiles (auto-created on signup)

See `supabase_schema.sql` for complete schema.

## 📧 Email Setup

To enable order notification emails:
1. Create account at https://www.emailjs.com (free)
2. Set up email service and template
3. Add credentials to `.env`

Detailed guide: `EMAIL_SETUP_GUIDE.md`

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

Detailed guide: `DEPLOYMENT_GUIDE.md`

## 📖 Documentation

- `CLIENT_HANDOFF_GUIDE.md` - Complete client handoff instructions
- `SIMPLE_DATA_ENTRY_GUIDE.md` - How to add/manage books
- `EMAIL_SETUP_GUIDE.md` - Email notification setup
- `DEPLOYMENT_GUIDE.md` - GitHub and Vercel deployment
- `IMAGE_OPTIMIZATION_GUIDE.md` - Image performance tips
- `LOGIN_EMAIL_TESTING_GUIDE.md` - Testing authentication

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
books-ecommerce/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Reusable components
│   ├── context/         # React context (Cart, Auth, etc.)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── supabase_schema.sql  # Database schema
├── .env.example         # Environment variables template
└── package.json         # Dependencies
```

## 🎨 Features in Detail

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent storage (localStorage)
- Drawer UI for quick access

### User Authentication
- Email/password signup
- Email verification
- Secure login
- Password reset
- Protected routes

### Product Management
- Browse books by category
- Filter and search
- Product details page
- Stock management
- Combo deals

### Checkout
- Multi-step checkout flow
- Form validation
- Order confirmation
- Email notifications

## 🔐 Security

- Row Level Security (RLS) enabled
- Environment variables for secrets
- Input sanitization
- XSS protection
- CSRF protection via Supabase

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimized
- Desktop layouts
- Touch-friendly UI

## 🌟 Performance

- Lazy loading for pages
- Image optimization
- Code splitting
- Asset compression
- CDN delivery (Vercel)

## 📊 Analytics

Optional integrations:
- Vercel Analytics
- Google Analytics
- Custom tracking

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions:
- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/YOUR-USERNAME/books-ecommerce/issues)

## 🙏 Acknowledgments

- React Team
- Supabase Team
- TailwindCSS Team
- Lucide Icons
- EmailJS

## 📈 Roadmap

Future enhancements:
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Admin dashboard
- [ ] Customer reviews and ratings
- [ ] Wishlist sync across devices
- [ ] Advanced search with autocomplete
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support

---

**Made with ❤️ for book lovers**

**Live Demo:** https://your-project.vercel.app
**Author:** Your Name
**Contact:** your-email@example.com
