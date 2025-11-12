# Skills for Life Training PLC

A modern, professional training website for Skills for Life Training PLC that empowers individuals with essential skills and knowledge for career success.

## 🚀 Features

- **Modern Design**: Clean global UI patterns with Ethiopian visual accents
- **Hero Section**: Full-bleed video background with dual-audience toggle (Employer/Student)
- **Training Programs**: Functional program listings with advanced filters (location, category, type, keyword search)
- **Program Details**: Individual program pages with enrollment modal/form
- **Success Stories**: Human-centered testimonials and student journeys
- **About Page**: Mission, values, timeline, and team information
- **Contact Form**: Integrated contact form with Google Maps embed
- **Admin Dashboard**: Protected admin area for managing programs and viewing inquiries
- **SEO Optimized**: Meta tags, schema.org markup for JobPosting and Organization
- **Accessibility**: WCAG AA baseline compliance
- **Performance**: Optimized for 90+ Lighthouse scores

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Josefin Sans
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skills-for-life-training
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Primary**: `#0D9488` (Sophisticated Teal)
- **Accent**: `#06B6D4` (Vibrant Cyan)
- **Secondary**: `#1E40AF` (Deep Blue)
- **Dark**: `#0F172A` (Slate Dark)
- **Light**: `#F0FDFA` (Mint Cream)

### Typography
- **Font**: Josefin Sans (headings and body)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Nav/Footer
│   ├── page.tsx            # Home page
│   ├── jobs/
│   │   ├── page.tsx        # Programs list page
│   │   └── [slug]/
│   │       └── page.tsx    # Program detail page
│   ├── about/
│   │   └── page.tsx        # About page
│   ├── contact/
│   │   └── page.tsx        # Contact page
│   └── admin/
│       └── page.tsx        # Admin dashboard
├── components/
│   ├── Nav.tsx             # Navigation with glass effect
│   ├── Footer.tsx          # Footer component
│   ├── Hero.tsx            # Hero section with image
│   ├── Services.tsx        # Services section
│   ├── HowItWorks.tsx      # How it works section
│   ├── StorySection.tsx    # Storytelling section
│   ├── WorkerShowcase.tsx  # Worker showcase section
│   ├── PathToDeployment.tsx # Path to deployment timeline
│   ├── SuccessStories.tsx  # Success stories section
│   ├── AboutMission.tsx     # About/Mission section
│   ├── EnrollModal.tsx     # Enrollment modal
│   ├── CandidateCard.tsx   # Candidate profile card
│   ├── ClientRequestForm.tsx # Employer request form
│   └── RequestShortlistModal.tsx # Shortlist request modal
├── data/
│   ├── jobs.json           # Seed job data
│   ├── programs.json       # Training programs data
│   └── candidates.json     # Candidate profiles data
└── public/                 # Static assets
```

## 🔧 Configuration

### Environment Variables (Optional)

For production with Supabase integration, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Google Maps

The contact page includes a Google Maps embed. To customize the location:

1. Get the embed URL from Google Maps
2. Update the `iframe` `src` in `app/contact/page.tsx`

## 📝 Adding Training Programs

Programs are stored in `data/jobs.json`. To add a new program:

```json
{
  "id": "program-XXX",
  "title": "Program Title",
  "location": "City, Country",
  "category": "Category",
  "type": "Full-time",
  "slug": "program-title-slug",
  "description": "Program description...",
  "requirements": "Program requirements...",
  "posted_at": "2025-11-10",
  "apply_email": "careers@skillsforlife.com"
}
```

## 🔐 Admin Access

The admin dashboard is protected with a simple password (for demo purposes).

- **URL**: `/admin`
- **Default Password**: `skillsforlife2024`

In production, implement proper authentication (e.g., NextAuth.js, Supabase Auth).

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically

### Manual Build

```bash
npm run build
npm start
```

## 📊 Performance

The site is optimized for performance:
- Image optimization with Next.js Image component
- Lazy loading for images and components
- Code splitting and tree shaking
- Optimized fonts with `next/font`

Target: **90+ Lighthouse Performance Score**

## ♿ Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Alt text for images
- WCAG AA color contrast compliance

## 🔍 SEO

- Meta tags for all pages
- Schema.org markup (Organization, JobPosting)
- Open Graph tags
- Twitter Card support
- Semantic HTML structure

## 📄 License

ISC

## 👥 Contact

- **Email**: info@skillsforlife.com
- **Phone**: +251 911 234 567
- **Location**: Addis Ababa, Ethiopia

---

Built with ❤️ for Skills for Life Training PLC
