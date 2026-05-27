# World of Stone — Agent Handoff Brief

## Project Location

`C:\Users\zanem\OneDrive\Desktop\world-of-stone`

## What Has Been Built (Phase 1 — Complete)

A full-stack Next.js 16.2.6 business website for **World of Stone**, a South African stone materials supplier and installer. The site is a product catalog + lead-gen system with a Firebase-backed CMS
admin panel.

### Tech Stack

- **Next.js 16.2.6** (App Router, Turbopack)
- **Tailwind CSS v4** — CSS-based theming via `@theme` block in `src/app/globals.css` (no `tailwind.config.js`)
- **Firebase 12.x** — Firestore (products/projects/promotions DB), Auth (admin login), Storage (images)
- **Framer Motion** — animations on hero/sections
- **React Icons** (Hi set)
- **Fonts**: Inter (body) + Cormorant Garamond (display headings) via `next/font/google`

### Critical Next.js 16 Convention

`params` in dynamic routes is a **Promise** — always `const { slug } = await params`. This is already applied everywhere.

### Theme Colours (CSS variables in globals.css)

```
--background: #0c0b09   --surface: #161410   --surface-2: #201e18
--border: #2e2b22       --gold: #c9a84c      --gold-light: #e8c97a
--stone: #8a8778        --foreground: #f0ede6  --foreground-muted: #9e9b8e
```

### All Files Created

```
src/
├── app/
│   ├── globals.css                     ← dark luxury stone theme + @theme block
│   ├── layout.tsx                      ← Inter + Cormorant fonts, full OG metadata
│   ├── page.tsx                        ← Homepage (server, ISR revalidate=60)
│   ├── catalog/page.tsx                ← Product catalog with client-side filter/sort
│   ├── product/[slug]/
│   │   ├── page.tsx                    ← Product detail (server, generateMetadata, JSON-LD)
│   │   └── ProductDetailClient.tsx     ← Image gallery, view tracking, WhatsApp CTA
│   ├── projects/page.tsx               ← Portfolio grid (server)
│   ├── about/page.tsx                  ← Company story + timeline (server)
│   ├── contact/page.tsx                ← Contact form → WhatsApp (client component)
│   └── admin/
│       ├── layout.tsx                  ← Wraps all admin with AuthProvider
│       ├── login/page.tsx              ← Firebase email/password login
│       ├── page.tsx                    ← Dashboard: stats + top products by views
│       ├── products/page.tsx           ← Full product CRUD (add/edit modal, hide/delete)
│       ├── projects/page.tsx           ← Project CRUD
│       └── promotions/page.tsx         ← Promotions management (create, activate/deactivate)
├── components/
│   ├── Navbar.tsx                      ← Sticky, transparent→opaque on scroll, mobile menu
│   ├── Footer.tsx                      ← Brand, nav links, WhatsApp/Instagram/Facebook
│   ├── HeroSection.tsx                 ← Animated hero (Framer Motion), stats, dual CTAs
│   ├── FeaturedMaterials.tsx           ← Product grid from Firestore featured products
│   ├── MaterialCategories.tsx          ← Category links → /catalog?material=<type>
│   ├── WhyChooseUs.tsx                 ← 6 trust reasons
│   ├── RecentProjects.tsx              ← Projects preview grid
│   ├── ContactBanner.tsx               ← WhatsApp + contact page CTA
│   ├── ProductCard.tsx                 ← Card with badges, price, WhatsApp inquiry link
│   ├── WhatsAppButton.tsx              ← Multi-variant (floating|inline|cta), tracks inquiries
│   └── AdminGuard.tsx                  ← Redirects unauthenticated users → /admin/login
├── lib/
│   ├── firebase.ts                     ← Firebase app init (singleton), exports db/auth/storage
│   ├── firestore.ts                    ← All Firestore CRUD: products, projects, promotions
│   └── auth-context.tsx                ← AuthProvider + useAuth() hook
└── types/
    └── index.ts                        ← Product, Project, Promotion, FilterState, SortOption types
```

### Config Files Updated

- `next.config.ts` — `images.remotePatterns` includes `firebasestorage.googleapis.com` and `*.firebasestorage.app`
- `.env.local.example` — template with all required env var keys

---

## Remaining Tasks

### 1. Fix `contact/page.tsx` Metadata (High Priority)

The contact page is `"use client"` but needs SEO metadata. Next.js 16 does not allow `export const metadata` in client components. **Fix**: Split into a thin server wrapper + client form component.

Create `src/app/contact/ContactForm.tsx` (move all the form/client logic there), then replace `src/app/contact/page.tsx` with a server component that exports metadata and renders `<ContactForm />`.

### 2. Firebase Project Setup (User Action Required)

The user must:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Firestore Database** (start in production mode)
3. Enable **Authentication** → Email/Password provider
4. Enable **Storage**
5. Create an admin user: Authentication → Add User
6. Copy `.env.local.example` → `.env.local` and fill in all values

### 3. Firestore Security Rules

After Firebase is set up, apply these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /projects/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /promotions/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Seed Initial Data (Optional but Recommended)

Create a seed script or manually add a few products via the admin panel at `/admin/products` after Firebase is connected. Products need: `name`, `slug` (auto-generated), `materialType`, `images[]`,
`featured: true` for homepage display.

### 5. Optional: WhatsApp Number

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to the actual business number in international format (e.g. `27821234567` for +27 82 123 4567).

### 6. Phase 2 Features (Future)

- Firebase Storage image upload in admin (currently uses image URL input)
- Product view/inquiry analytics charts on admin dashboard
- Email inquiry form with backend (e.g. Resend or Nodemailer)
- Sitemap generation using live Firestore product slugs
- ISR on-demand revalidation via `/api/revalidate` route

---

## Running the Dev Server

```powershell
cd "C:\Users\zanem\OneDrive\Desktop\world-of-stone"
npm run dev
```

Open http://localhost:3000

TypeScript check: `npx tsc --noEmit` (currently passes with zero errors)

## Firestore Collections

- `products` — stone material listings
- `projects` — completed installation portfolio
- `promotions` — banner/badge/popup announcements
