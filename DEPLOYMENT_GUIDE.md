# 🚀 GitHub & Vercel Deployment Guide

## Complete Instructions to Deploy Your Website

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account (free): https://github.com/signup
- [ ] Vercel account (free): https://vercel.com/signup
- [ ] Git installed on your computer

**Check if Git is installed:**
```bash
git --version
```
If not installed, download from: https://git-scm.com/downloads

---

## 🔐 Step 1: Prepare Environment Variables

**Create `.env.example` file** (for documentation, NOT for secrets):
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration (Optional)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

**⚠️ Important:** Your `.env` file is already in `.gitignore` - it won't be uploaded to GitHub (secure!)

---

## 📦 Step 2: Push to GitHub

Run these commands in PowerShell (in your project directory):

```powershell
# 1. Initialize Git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "Initial commit - Books E-commerce Website"

# 4. Create repository on GitHub
# Go to https://github.com/new
# - Repository name: books-ecommerce (or any name)
# - Description: Online Books Store E-commerce Website
# - Choose: Public or Private
# - DON'T initialize with README (we already have code)
# - Click "Create repository"

# 5. Connect to GitHub repository
# Replace YOUR-USERNAME and YOUR-REPO with your actual GitHub username and repo name
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# 6. Rename branch to main (if needed)
git branch -M main

# 7. Push code to GitHub
git push -u origin main
```

**Example with actual values:**
```powershell
git remote add origin https://github.com/johndoe/books-store.git
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use Personal Access Token (not your password)
  - Generate token: https://github.com/settings/tokens
  - Select: `repo` scope
  - Copy token and paste as password

---

## 🌐 Step 3: Deploy to Vercel

### **Method 1: Using Vercel Dashboard (Easiest)**

**1. Go to Vercel:**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Login"
   - Sign in with GitHub

**2. Import Project:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `books-ecommerce` repository
   - Click "Import"

**3. Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   Install Command: npm install (auto-detected)
   ```

**4. Add Environment Variables:**
   - Click "Environment Variables"
   - Add each variable:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://xxxxx.supabase.co
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   
   Name: VITE_EMAILJS_SERVICE_ID
   Value: service_xxxxx
   
   Name: VITE_EMAILJS_TEMPLATE_ID
   Value: template_xxxxx
   
   Name: VITE_EMAILJS_PUBLIC_KEY
   Value: xxxxx
   ```

**5. Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Done! Your site is live!

**Your site URL will be:**
```
https://your-project-name.vercel.app
```

---

### **Method 2: Using Vercel CLI**

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? books-ecommerce
# - Directory? ./
# - Want to override settings? No

# Production deployment
vercel --prod
```

---

## 🔧 Step 4: Configure Vercel Settings

### **Update Supabase URLs:**

**In Supabase Dashboard:**
1. Go to Authentication → URL Configuration
2. Update **Site URL:**
   ```
   https://your-project.vercel.app
   ```
3. Add **Redirect URLs:**
   ```
   https://your-project.vercel.app/account
   https://your-project.vercel.app/reset-password
   https://your-project.vercel.app/**
   ```

### **Custom Domain (Optional):**

**In Vercel:**
1. Project Settings → Domains
2. Add your domain: `www.yourbookstore.com`
3. Follow DNS configuration instructions
4. Update Supabase Site URL to custom domain

---

## 🔄 Step 5: Future Updates

**When you make changes to code:**

```powershell
# 1. Make your changes to code
# 2. Test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "Updated features"

# 4. Push to GitHub
git push

# Vercel automatically deploys! ✨
# Check deployment status at: https://vercel.com/dashboard
```

**Auto-deployment is enabled by default!**
- Every push to `main` branch = automatic deployment
- View deployment logs in Vercel dashboard

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] Books display correctly
- [ ] Images load (if using external URLs)
- [ ] Add to cart works
- [ ] Checkout process completes
- [ ] Orders save to database
- [ ] Email notifications work (if configured)
- [ ] Login/signup works
- [ ] Mobile responsive design verified
- [ ] No console errors

---

## 🐛 Troubleshooting

### **Problem: Build Failed on Vercel**

**Check build logs:**
1. Vercel Dashboard → Deployments → Failed deployment
2. Click "View Build Logs"

**Common fixes:**
```powershell
# Ensure build works locally
npm run build

# If successful locally, check:
# - All dependencies in package.json
# - No TypeScript errors
# - No import errors
```

### **Problem: Environment Variables Not Working**

**Solutions:**
1. Vercel → Project Settings → Environment Variables
2. Make sure variable names start with `VITE_`
3. Redeploy after adding variables:
   - Deployments → Three dots → "Redeploy"

### **Problem: 404 on Page Refresh**

**Solution:**
Add `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Then commit and push:
```powershell
git add vercel.json
git commit -m "Fix routing"
git push
```

### **Problem: Images Not Loading**

**If using local images:**
- Make sure images are in `public/` folder
- Use external URLs (recommended)

**If using Supabase Storage:**
- Check bucket is public
- Verify image URLs are correct

---

## 📊 Monitor Your Deployment

### **Vercel Analytics (Free):**
1. Project Settings → Analytics
2. Enable Web Analytics
3. View visitor stats, page views, etc.

### **Performance:**
- Vercel automatically optimizes builds
- CDN distribution worldwide
- Automatic HTTPS

---

## 💰 Cost Breakdown

### **Completely FREE for:**
- ✅ GitHub (unlimited public/private repos)
- ✅ Vercel (Hobby plan - perfect for client projects)
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic SSL
  - Custom domains
- ✅ Supabase (Free tier)
  - 500 MB database
  - 1 GB file storage
  - 50,000 monthly active users

**Total Cost: ₹0/month** 🎉

---

## 🎯 Share with Client

**Send client these links:**
```
Live Website: https://your-project.vercel.app
GitHub Repo: https://github.com/your-username/your-repo
Supabase Dashboard: https://supabase.com/dashboard/project/xxxxx

Admin Access:
Vercel: (add them as team member if needed)
Supabase: (already provided access)
```

---

## 🔐 Security Notes

**What's in GitHub (Public):**
- ✅ Source code
- ✅ `.env.example` (template only)
- ❌ No secrets (.env is gitignored)

**Environment variables are secure:**
- Stored in Vercel dashboard
- Not visible in code
- Encrypted at rest

---

## 📱 Test Your Deployed Site

**Open in multiple devices:**
- Desktop browser
- Mobile phone
- Tablet
- Different browsers (Chrome, Firefox, Safari)

**Test all features:**
- Browse books
- Add to cart
- Checkout
- Login/signup
- Place order
- Check if email arrives

---

**You're all set! Your website is now live on the internet! 🚀**

**Live URL:** https://your-project.vercel.app
**GitHub:** https://github.com/your-username/your-repo
