# Cambo Cinema Takeo - System Design Document

> **Brand:** Cambo Cinema Takeo
> **Location:** Takeo Province, Cambodia
> **Purpose:** Web-based cinema booking system with e-tickets, payment integration, and admin dashboard
> **Created:** February 9, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Brand Identity & Design System](#3-brand-identity--design-system)
4. [Customer Journey & Pages](#4-customer-journey--pages)
5. [Seat Booking System](#5-seat-booking-system)
6. [Payment Integration](#6-payment-integration)
7. [Customer Accounts & Wallet](#7-customer-accounts--wallet)
8. [Cashier Dashboard](#8-cashier-dashboard)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Database Schema](#10-database-schema)
11. [Implementation Phases](#11-implementation-phases)
12. [Future Considerations](#12-future-considerations)

---

## 1. Project Overview

### Problem
- Theater branch has no website
- No online booking capability
- Manual ticketing process
- No revenue analytics

### Solution
A complete web-based cinema system that handles:
- Online movie browsing and booking
- QR-based payment (Bakong, Visa, wallet credits)
- E-ticket generation with QR verification
- Walk-in sales for cashiers
- Revenue analytics for admin

### Key Goals
- **Pitch Demo First:** Beautiful, interactive prototype to present to owner
- **Mobile-First:** 70%+ users on phones
- **Khmer-First:** Default language with EN/CN options
- **Full Automation:** Minimal manual intervention

### User Roles

| Role | Access | Purpose |
|------|--------|---------|
| **Customer** | Public pages | Browse movies, book seats, pay online, get e-ticket |
| **Cashier** | `/cashier` | Sell walk-in tickets, verify e-tickets, print tickets |
| **Admin** | `/admin` | Manage movies, view revenue, configure system |

---

## 2. Tech Stack & Architecture

### Technology Choices

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 16 (App Router) | Latest, server components, great SEO |
| **Styling** | Tailwind CSS | Rapid development, custom design tokens |
| **UI Components** | Shadcn/ui | Polished base, fully customizable |
| **Animations** | Framer Motion | Smooth page transitions, seat picker, timers |
| **Database** | Supabase (Postgres) | Realtime, auth, row-level security, free tier |
| **Payments** | Python Gateway (existing) | Bakong QR, Visa, wallet |
| **Hosting** | Vercel + Supabase | Easy deployment, auto-scaling |
| **i18n** | next-intl | Khmer/English/Chinese support |
| **SEO** | Next.js Metadata API | JSON-LD, Open Graph |

### Project Structure

```
/app
  /(customer)           → Public booking flow
    /                   → Homepage
    /movies/[slug]      → Movie detail
    /book/[showtimeId]  → Seat selection
    /book/[showtimeId]/pay      → Payment
    /book/[showtimeId]/success  → Confirmation
    /account            → Customer account (optional login)
  /(cashier)            → Staff verification, walk-in sales
    /cashier            → Cashier dashboard
    /cashier/sell       → Walk-in sale flow
    /cashier/verify     → QR scanner
  /(admin)              → Dashboard, movie management
    /admin              → Overview
    /admin/movies       → Movie management
    /admin/showtimes    → Schedule management
    /admin/bookings     → All reservations
    /admin/revenue      → Financial reports
    /admin/promos       → Discount codes
    /admin/staff        → Manage cashiers
    /admin/settings     → Branch config
/components             → Shared UI components
/lib                    → Database, payment gateway client
/api                    → Next.js API routes
/messages               → i18n translations (km, en, cn)
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMERS                                │
│                    (Mobile / Desktop)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Next.js 16)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Customer   │  │   Cashier   │  │        Admin            │  │
│  │    Pages    │  │   Dashboard │  │      Dashboard          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │   API Routes      │                        │
│                    │  /api/bookings    │                        │
│                    │  /api/movies      │                        │
│                    │  /api/payments    │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    SUPABASE     │  │  PYTHON GATEWAY │  │  PARTNER API    │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │
│  │ Postgres  │  │  │  │  Bakong   │  │  │  │  Movies   │  │
│  │ Realtime  │  │  │  │  Visa     │  │  │  │  Trailers │  │
│  │ Auth      │  │  │  │  Wallet   │  │  │  │  (Khmer)  │  │
│  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 3. Brand Identity & Design System

### Brand

- **Name:** Cambo Cinema Takeo
- **Location:** Takeo Province, Cambodia
- **Languages:** Khmer (primary), English, Chinese

### Color Palette

```css
:root {
  /* Primary */
  --gold:          #D4AF37;   /* Rich gold - CTAs, highlights */
  --gold-light:    #E5C76B;   /* Hover states */
  --gold-dark:     #B8960C;   /* Active states */

  /* Secondary */
  --burgundy:      #8B1538;   /* Deep red - backgrounds, accents */
  --burgundy-dark: #5C0E24;   /* Darker sections */

  /* Base */
  --dark:          #1A0A0F;   /* Near-black with red tint */
  --dark-light:    #2D1219;   /* Cards, elevated surfaces */

  /* Text */
  --text-primary:  #F5F0E6;   /* Warm white */
  --text-secondary:#B8A99A;   /* Muted text */

  /* Status */
  --success:       #2D8B4E;   /* Available seats, confirmed */
  --error:         #DC2626;   /* Errors, taken seats */
  --warning:       #F59E0B;   /* Warnings, timers */
}
```

### Typography

| Usage | Font | Fallback |
|-------|------|----------|
| Khmer text | Kantumruy Pro | Battambang, system-ui |
| English/Chinese | Inter | system-ui |
| Headings | Kantumruy Pro (bold) | - |

### Design Principles

1. **Mobile-First** - Design for phones, enhance for desktop
2. **Khmer-First** - Proper text sizing for Khmer script (larger than Latin)
3. **Large Touch Targets** - Minimum 44px for seats, buttons
4. **Minimal Clicks** - Homepage → Movie → Showtime → Seats → Pay (4 steps)
5. **Smooth Transitions** - Framer Motion for all page/element animations
6. **No Distractions** - Focus on the booking flow

### Component Library

Based on Shadcn/ui, customized with brand colors:
- Buttons (primary gold, secondary burgundy, ghost)
- Cards (movie posters, booking summary)
- Dialogs (confirmations, errors)
- Forms (inputs, selects, OTP input)
- Seat picker (custom component)
- Timer (animated countdown)
- Language switcher
- Date picker pills

---

## 4. Customer Journey & Pages

### Page Flow

```
Homepage → Movie Detail → Seat Selection → Payment → Confirmation
    │           │              │              │           │
    │           │              │              │           ▼
    │           │              │              │      E-Ticket QR
    │           │              │              │           │
    │           │              │              ▼           ▼
    │           │              │         API Polling   [Done]
    │           │              │              │
    │           │              ▼              │
    │           │        2 min timer ────────►│
    │           │              │              │
    │           ▼              │              │
    │      Select Showtime ────┘              │
    │              │                          │
    ▼              │                          │
Browse Movies ─────┘                          │
                                              │
Account (optional) ◄──────────────────────────┘
    │
    ├── Wallet (top-up, balance)
    ├── Booking History
    └── My Tickets
```

### Homepage (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│  🎬 CAMBO CINEMA TAKEO        🔍 Search    🇰🇭│EN│中文         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │              HERO: Featured Movie Trailer                 │  │
│  │              (auto-play muted, with gradient overlay)     │  │
│  │                                                           │  │
│  │                    ▶ Watch Trailer                        │  │
│  │                    [Book Now]                             │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│   កំពុងចាក់បញ្ចាំង  │  មកដល់ឆាប់ៗ                              │
│   (Now Showing)      (Coming Soon)                              │
│                                                                 │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│   │ Today │ │  10   │ │  11   │ │  12   │ │  13   │ ◄── Date   │
│   │  9    │ │  Feb  │ │  Feb  │ │  Feb  │ │  Feb  │     Pills  │
│   └───────┘ └───────┘ └───────┘ └───────┘ └───────┘            │
│                                                                 │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│   │  [Poster]   │ │  [Poster]   │ │  [Poster]   │               │
│   │             │ │             │ │             │               │
│   │  ┌──┐ ┌──┐  │ │  ┌──┐ ┌──┐  │ │  ┌──┐ ┌──┐  │               │
│   │  │KH│ │15│  │ │  │EN│ │18│  │ │  │KH│ │PG│  │ ◄── Badges   │
│   │  └──┘ └──┘  │ │  └──┘ └──┘  │ │  └──┘ └──┘  │               │
│   │             │ │             │ │             │               │
│   │ Movie Title │ │ Movie Title │ │ Movie Title │               │
│   │             │ │             │ │             │               │
│   │ 14:00 18:00 │ │ 16:30 21:00 │ │ 15:00 20:00 │ ◄── Showtimes │
│   └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Footer: 📍 Location │ 📞 Contact │ 📱 Social │ © 2026          │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Sticky header with search and language switcher
- Hero section with featured movie trailer (muted autoplay)
- Now Showing / Coming Soon tabs
- Date picker pills (horizontal scroll on mobile)
- Movie cards with:
  - Poster image
  - Subtitle language badge (ខ្មែរ/EN)
  - Rating badge (PG, 15, 18+)
  - Title (localized)
  - Quick showtime buttons
- Footer with location, contact, social links

### Movie Detail (`/movies/[slug]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                    🔍         🇰🇭│EN│中文               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │              TRAILER (Localized from partner API)         │  │
│  │                         ▶                                 │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────┐                                                    │
│  │ Poster  │  Movie Title ភាពយន្តឈ្មោះ                         │
│  │         │                                                    │
│  │         │  ⏱ 2h 15min  │  🎭 Action, Drama  │  📅 Feb 2026   │
│  │         │                                                    │
│  │         │  ┌──────┐ ┌──────┐                                 │
│  │         │  │ ខ្មែរ │ │  15  │  Subtitle & Rating badges      │
│  │         │  └──────┘ └──────┘                                 │
│  └─────────┘                                                    │
│                                                                 │
│  Synopsis:                                                      │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit...     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│   ម៉ោងចាក់បញ្ចាំង (Showtimes)                                   │
│                                                                 │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                       │
│   │ Today │ │  10   │ │  11   │ │  12   │                       │
│   └───────┘ └───────┘ └───────┘ └───────┘                       │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│   │  14:00   │  │  16:30   │  │  21:00   │                      │
│   │ 45/120   │  │ 78/120   │  │ 12/120   │  ◄── Available seats │
│   └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Embedded trailer (localized version from partner API)
- Movie metadata (duration, genre, release date)
- Subtitle language and rating badges
- Synopsis (localized)
- Date picker
- Showtime buttons with seat availability
- Tap showtime → navigate to seat selection

### Seat Selection (`/book/[showtimeId]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back           ⏱ 1:45 remaining                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ① Select Seats ────────── ② Payment ────────── ③ Confirm      │
│       ●                        ○                    ○           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                        SCREEN                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│     A  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                         │
│     B  ○ ○ ○ ○ ○ ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○    ○ = Available        │
│     C  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ● ● ● ○ ○ ○    ● = Taken            │
│     D  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○    ◉ = Selected         │
│     E  ○ ○ ○ ○ ○ ○ ○ ◉ ◉ ○ ○ ○ ○ ○ ○ ○                         │
│     F  ○ ○ ○ ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○                         │
│     G  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                         │
│     H  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                         │
│                                                                 │
│     [−]  Zoom  [+]              Pinch to zoom on mobile         │
│                                                                 │
│  Legend:  ○ Available   ● Taken   ◉ Your selection              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   🎬 Movie Name │ 📅 Feb 10 │ ⏰ 18:00                           │
│   💺 E8, E9     │ 💰 $8.00                                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Continue to Payment                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Progress indicator (3 steps)
- Countdown timer (2 minutes for seat selection)
- Interactive seat map with pinch-zoom on mobile
- Real-time seat availability (Supabase realtime)
- Seat gap validation (no single empty seats)
- Floating bottom bar with selection summary
- Smooth transitions when selecting seats

### Payment (`/book/[showtimeId]/pay`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back           ⏱ 4:32 remaining                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ① Select Seats ────────── ② Payment ────────── ③ Confirm      │
│       ✓                        ●                    ○           │
│                                                                 │
│  ┌─────────────────────────────────┐ ┌─────────────────────────┐│
│  │                                 │ │ Order Summary           ││
│  │  Guest Information              │ │                         ││
│  │                                 │ │ ┌─────┐ Movie Title     ││
│  │  Phone Number *                 │ │ │Poster│                ││
│  │  ┌───────────────────────────┐  │ │ └─────┘ Feb 10, 18:00   ││
│  │  │ 012 345 678               │  │ │                         ││
│  │  └───────────────────────────┘  │ │ Seats: E8, E9           ││
│  │                                 │ │                         ││
│  │  Email (optional)               │ │ ─────────────────────── ││
│  │  ┌───────────────────────────┐  │ │                         ││
│  │  │ email@example.com         │  │ │ Subtotal:      $8.00    ││
│  │  └───────────────────────────┘  │ │                         ││
│  │                                 │ │ Promo Code:             ││
│  │  ─────────────────────────────  │ │ ┌─────────────┐ [Apply] ││
│  │                                 │ │ │ SAVE10      │         ││
│  │  Payment Method                 │ │ └─────────────┘         ││
│  │                                 │ │                         ││
│  │  ┌─────────────────────────┐    │ │ Discount:      -$0.80   ││
│  │  │ ◉ Bakong QR     [KHQR] │    │ │                         ││
│  │  │   Scan with any bank   │    │ │ ═════════════════════   ││
│  │  └─────────────────────────┘    │ │ Total:         $7.20    ││
│  │                                 │ │                         ││
│  │  ┌─────────────────────────┐    │ └─────────────────────────┘│
│  │  │ ○ Visa / Mastercard    │    │                            │
│  │  └─────────────────────────┘    │                            │
│  │                                 │                            │
│  │  ┌─────────────────────────┐    │                            │
│  │  │ ○ Wallet Credit ($25)  │    │  ◄── If logged in          │
│  │  └─────────────────────────┘    │                            │
│  │                                 │                            │
│  │  ┌───────────────────────────┐  │                            │
│  │  │                           │  │                            │
│  │  │      [QR CODE HERE]       │  │  ◄── Dynamic QR            │
│  │  │                           │  │      from payment gateway  │
│  │  │                           │  │                            │
│  │  └───────────────────────────┘  │                            │
│  │                                 │                            │
│  │  Waiting for payment...  ◌      │                            │
│  │                                 │                            │
│  └─────────────────────────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 5-minute countdown timer (extended from seat selection)
- Guest checkout (phone required, email optional)
- Payment method selection:
  - Bakong QR (primary - shows KHQR code)
  - Visa/Mastercard
  - Wallet credit (if logged in with balance)
- Promo code input with validation
- Order summary with movie poster
- Real-time payment status polling
- Auto-redirect on successful payment

### Confirmation (`/book/[showtimeId]/success`)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ✓ Booking Confirmed!                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                 ┌─────────────────────────┐                     │
│                 │                         │                     │
│                 │      E-TICKET QR        │                     │
│                 │                         │                     │
│                 │    [QR CODE HERE]       │                     │
│                 │                         │                     │
│                 │   INV-20260210-0042     │                     │
│                 │                         │                     │
│                 └─────────────────────────┘                     │
│                                                                 │
│                 ┌─────────────────────────┐                     │
│                 │ 🎬 Movie Title          │                     │
│                 │ 📅 February 10, 2026    │                     │
│                 │ ⏰ 18:00                 │                     │
│                 │ 💺 Seats: E8, E9        │                     │
│                 │ 💰 Paid: $7.20          │                     │
│                 └─────────────────────────┘                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 📥 Download  │  │ 📅 Calendar  │  │ 📤 Share     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  Show this QR code at the cinema entrance                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Book Another Movie                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Success animation on load
- E-ticket with QR code (contains encrypted booking data)
- Invoice number
- Booking details
- Action buttons:
  - Download ticket (PDF/image)
  - Add to calendar
  - Share
- Instructions for check-in
- CTA to book another movie

---

## 5. Seat Booking System

### Booking Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browse     │     │   Select     │     │   Payment    │
│   Movies     │────▶│   Seats      │────▶│   Page       │
│              │     │  (2 min)     │     │  (5 min)     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                    │
                            ▼                    ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  SeatHold    │     │  Booking     │
                     │  (temporary) │────▶│  (permanent) │
                     └──────────────┘     └──────────────┘
                            │
                            ▼ (expires)
                     ┌──────────────┐
                     │   Released   │
                     │   back to    │
                     │   available  │
                     └──────────────┘
```

### Timed Hold System

| Stage | Timer | What Happens on Expire |
|-------|-------|------------------------|
| Seat Selection | 2 minutes | Seats released, user redirected |
| Payment | 5 minutes | Seats released, booking cancelled |

### Seat Gap Validation

**Rule:** Cannot leave a single empty seat between bookings.

```
Valid selections:
  ○ ○ ◉ ◉ ◉ ○ ○     (consecutive seats)
  ○ ○ ○ ◉ ◉ ● ●     (next to already taken)

Invalid selections:
  ○ ◉ ○ ◉ ○ ○ ○     (single gap between selections)
  ○ ○ ◉ ○ ● ○ ○     (single gap next to taken seat)
```

**Error Message:**
> "កុំទុកកៅអីទំនេរ - Please don't leave single seat gaps"

### Anti-Abuse Measures

| Protection | Implementation |
|------------|----------------|
| Device fingerprint | Max 3 active holds per device |
| Browser fingerprint | Canvas/WebGL fingerprint tracking |
| Captcha | Cloudflare Turnstile after 2 abandoned holds |
| Phone OTP | Optional, for suspicious patterns |

### Real-time Seat Updates

Using Supabase Realtime:
- When user A selects a seat → all other users see it as "held"
- When hold expires → all users see it as available again
- When booking confirmed → seat permanently marked as taken

---

## 6. Payment Integration

### Payment Gateway (Python)

Your existing Python payment gateway handles:
- Bakong QR generation (KHQR standard)
- Visa/Mastercard processing
- Wallet balance management
- Payment status tracking

### Integration Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Next.js    │     │   Python    │     │   Bank/     │
│  Frontend   │────▶│   Gateway   │────▶│   Payment   │
│             │     │             │     │   Network   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      │  1. Create        │                   │
      │     Invoice       │                   │
      │──────────────────▶│                   │
      │                   │                   │
      │  2. Return QR     │                   │
      │     + Invoice ID  │                   │
      │◀──────────────────│                   │
      │                   │                   │
      │  3. Display QR    │                   │
      │     to user       │                   │
      │                   │                   │
      │                   │  4. User pays     │
      │                   │◀──────────────────│
      │                   │                   │
      │  5. Poll status   │                   │
      │──────────────────▶│                   │
      │                   │                   │
      │  6. Return        │                   │
      │     "paid"        │                   │
      │◀──────────────────│                   │
      │                   │                   │
      │  7. Confirm       │                   │
      │     booking       │                   │
      │                   │                   │
```

### API Endpoints (Next.js → Python Gateway)

```typescript
// Create payment invoice
POST /api/payments/create
{
  amount: number,
  currency: "USD",
  booking_id: string,
  payment_method: "bakong" | "visa" | "wallet",
  promo_code?: string
}
Response: {
  invoice_id: string,
  qr_code?: string,  // Base64 for Bakong
  amount_due: number,
  expires_at: string
}

// Check payment status
GET /api/payments/:invoice_id/status
Response: {
  status: "pending" | "paid" | "expired" | "failed",
  paid_at?: string
}

// Apply promo code
POST /api/promos/validate
{
  code: string,
  amount: number
}
Response: {
  valid: boolean,
  discount_type: "percentage" | "fixed",
  discount_value: number,
  final_amount: number
}
```

### QR Code Contents

The e-ticket QR encodes:
```json
{
  "invoice": "INV-20260210-0042",
  "seats": ["E8", "E9"],
  "showtime": "2026-02-10T18:00:00",
  "movie": "movie-slug",
  "hash": "sha256-signature"
}
```

Encrypted and signed to prevent tampering.

---

## 7. Customer Accounts & Wallet

### Account Philosophy

> **No login required to book**, but accounts unlock benefits.

### Benefits of Creating Account

| Benefit | Description |
|---------|-------------|
| 💰 Wallet | Top up credits, pay instantly |
| 📜 History | View all past bookings |
| 🎟️ Tickets | All e-tickets in one place |
| ⚡ Speed | Saved phone/email for faster checkout |

### Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Enter      │     │   Receive    │     │   Enter      │
│   Phone #    │────▶│   OTP via    │────▶│   OTP Code   │
│              │     │   SMS        │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │   Logged In  │
                                         │   (cookie)   │
                                         └──────────────┘
```

- Phone number + OTP (no passwords)
- Optional: Link email for receipts
- Session persists via secure HTTP-only cookie

### Customer Account Page (`/account`)

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 My Account                                    [Logout]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │                       │  │                       │          │
│  │   💰 Wallet Balance   │  │   🎁 Loyalty Points   │          │
│  │                       │  │                       │          │
│  │       $25.00          │  │       1,250           │          │
│  │                       │  │                       │          │
│  │     [Top Up]          │  │   (Earn 10 pts/$1)    │          │
│  │                       │  │                       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
│  ─────────────── My Tickets ───────────────────                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎬 Movie Title                              UPCOMING   │   │
│  │  📅 February 10, 2026  │  ⏰ 18:00  │  💺 E8, E9        │   │
│  │                                                         │   │
│  │  [View QR]    [Add to Calendar]    [Get Directions]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────── Booking History ───────────────────           │
│                                                                 │
│  │ Feb 8, 2026  │ Movie B     │ $8.00  │ ✓ Attended │         │
│  │ Feb 1, 2026  │ Movie A     │ $12.00 │ ✓ Attended │         │
│  │ Jan 25, 2026 │ Movie C     │ $6.00  │ ✗ Missed   │         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Wallet System

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     Top Up       │     │    Balance       │     │    Payment       │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ Via Bakong QR    │────▶│ Stored in DB     │────▶│ Deduct on        │
│ Via Visa Card    │     │ Real-time update │     │ checkout         │
│ Via Cash         │     │                  │     │ (instant)        │
│ (at counter)     │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

**Top-up Flow:**
1. Select amount ($5, $10, $20, custom)
2. Choose payment method
3. Complete payment
4. Balance updated immediately

**Payment with Wallet:**
- If balance >= total: instant checkout
- If balance < total: pay difference with other method
- Transaction logged for audit

---

## 8. Cashier Dashboard

### Purpose

- Sell walk-in tickets
- Verify e-tickets (scan QR)
- Print physical tickets
- View today's showtimes and sales

### Cashier Dashboard (`/cashier`)

```
┌─────────────────────────────────────────────────────────────────┐
│  CAMBO CINEMA TAKEO - Cashier                    Feb 10, 2026   │
│  👤 Sok Dara (Cashier)                              [Logout]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │                       │  │                       │          │
│  │      📷 SCAN QR       │  │    🎟️ SELL TICKET     │          │
│  │                       │  │                       │          │
│  │   Verify e-ticket     │  │    Walk-in sale       │          │
│  │                       │  │                       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
│  ─────────────── Today's Stats ───────────────────             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 🎟️ Sold     │  │ 💰 Revenue  │  │ ✓ Check-ins │             │
│  │    127      │  │   $508.00   │  │    89       │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ─────────────── Today's Showtimes ───────────────────         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎬 Movie A                                              │   │
│  │ 14:00 (done) │ 16:30 (now) │ 21:00 (upcoming)          │   │
│  │ Sold: 89/120 │ Sold: 45/120 │ Sold: 12/120              │   │
│  │                                      [View Seats]       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────── Recent Check-ins ───────────────────          │
│                                                                 │
│  │ ✓ E8, E9     │ Guest      │ 16:30 show │ 2 min ago  │       │
│  │ ✓ A5, A6, A7 │ 012345678  │ 16:30 show │ 5 min ago  │       │
│  │ ✓ C12        │ Walk-in    │ 16:30 show │ 8 min ago  │       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### QR Verification Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Tap        │     │   Camera     │     │   Validate   │
│   "Scan QR"  │────▶│   Opens      │────▶│   Ticket     │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                           ┌────────────────────┼────────────────────┐
                           ▼                                         ▼
                    ┌──────────────┐                          ┌──────────────┐
                    │   ✓ VALID    │                          │   ✗ INVALID  │
                    ├──────────────┤                          ├──────────────┤
                    │ Green screen │                          │ Red screen   │
                    │ Movie: X     │                          │              │
                    │ Seats: E8,E9 │                          │ Reason:      │
                    │ Time: 18:00  │                          │ - Expired    │
                    │              │                          │ - Already    │
                    │ [Print]      │                          │   used       │
                    │ [Check In]   │                          │ - Wrong date │
                    └──────────────┘                          └──────────────┘
```

**Validation Checks:**
1. Is the booking paid?
2. Is it for today/correct showtime?
3. Has it already been used (checked in)?
4. Is the QR signature valid?

### Walk-in Sale Flow

1. Select movie
2. Select showtime
3. Select seats (same picker as online)
4. Choose payment: Cash / Card / QR
5. Print ticket immediately

### Print Ticket

Physical ticket contains:
- Movie title
- Date and time
- Seat numbers
- Cinema name
- Barcode/QR for backup verification

---

## 9. Admin Dashboard

### Purpose

Full control over:
- Movies and showtimes
- Seat configuration
- Bookings
- Revenue analytics
- Promo codes
- Staff management
- System settings

### Admin Sidebar Navigation

```
┌──────────────────┐
│ 📊 Dashboard     │  ← Overview stats
│ 🎬 Movies        │  ← Add/edit movies
│ 📅 Showtimes     │  ← Schedule management
│ 💺 Seats         │  ← Configure layout
│ 🎟️ Bookings      │  ← All reservations
│ 💰 Revenue       │  ← Financial reports
│ 🎁 Promos        │  ← Discount codes
│ 👥 Staff         │  ← Manage cashiers
│ ⚙️ Settings      │  ← Branch config
└──────────────────┘
```

### Dashboard Overview (`/admin`)

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Dashboard                                    Feb 10, 2026   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Today     │  │  This Week  │  │ This Month  │             │
│  │             │  │             │  │             │             │
│  │   $450      │  │  $2,340     │  │  $8,920     │             │
│  │   +12% ▲    │  │   +8% ▲     │  │  +15% ▲     │             │
│  │             │  │             │  │             │             │
│  │  89 tickets │  │ 456 tickets │  │ 1,892 tix   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────────────────────┐  ┌───────────────────────────┐│
│  │  📈 Revenue Trend (7 days)  │  │  🔥 Top Movies            ││
│  │                             │  │                           ││
│  │       ╱╲                    │  │  1. Movie A    $1,200     ││
│  │      ╱  ╲    ╱╲             │  │  2. Movie B    $890       ││
│  │     ╱    ╲  ╱  ╲            │  │  3. Movie C    $650       ││
│  │    ╱      ╲╱    ╲           │  │  4. Movie D    $420       ││
│  │   ╱              ╲          │  │  5. Movie E    $380       ││
│  │  Mon Tue Wed Thu Fri Sat Sun│  │                           ││
│  └─────────────────────────────┘  └───────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────┐  ┌───────────────────────────┐│
│  │  🪑 Seat Heatmap            │  │  ⏰ Peak Booking Hours     ││
│  │                             │  │                           ││
│  │  ░░░▓▓████████▓▓░░░        │  │  ▁▂▃▅▇█████▇▅▃▂▁         ││
│  │  ░░░▓▓████████▓▓░░░        │  │                           ││
│  │  ░░▓▓▓████████▓▓▓░░        │  │  10  14  18  20  22       ││
│  │  ░░▓▓▓▓██████▓▓▓▓░░        │  │       (hours)             ││
│  │  ░░░░▓▓▓▓▓▓▓▓▓▓░░░░        │  │                           ││
│  │      (screen)               │  │  Peak: 7-9 PM            ││
│  └─────────────────────────────┘  └───────────────────────────┘│
│                                                                 │
│  ─────────────── Recent Bookings ───────────────────           │
│                                                                 │
│  │ #0042 │ Movie A │ E8,E9  │ $8.00  │ Online  │ 5 min ago │   │
│  │ #0041 │ Movie A │ C12    │ $4.00  │ Walk-in │ 12 min ago│   │
│  │ #0040 │ Movie B │ A1-A4  │ $16.00 │ Online  │ 18 min ago│   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Movie Management (`/admin/movies`)

**Features:**
- Search partner API → auto-fill movie data (Khmer localized)
- Manual entry fallback
- Upload custom poster if needed
- Set movie status: Now Showing / Coming Soon / Hidden

**Movie Form:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Add New Movie                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Search: [________________________] [Search Partner API]        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Title (Khmer):  [_________________________________]            │
│  Title (EN):     [_________________________________]            │
│  Title (中文):   [_________________________________]            │
│                                                                 │
│  Duration:       [___] minutes                                  │
│  Genre:          [Action     ▼]                                 │
│  Rating:         [PG  ▼]                                        │
│  Subtitle:       [Khmer ▼]                                      │
│                                                                 │
│  Poster:         [Upload] or [Use from API]                     │
│  Trailer URL:    [_________________________________]            │
│                                                                 │
│  Synopsis (KH):  [_________________________________]            │
│                  [_________________________________]            │
│                                                                 │
│  Status:         ◉ Now Showing  ○ Coming Soon  ○ Hidden         │
│                                                                 │
│                                        [Cancel]  [Save Movie]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Showtime Management (`/admin/showtimes`)

**Bulk Creation:**
1. Select movie
2. Select date range
3. Select times
4. Set price
5. Create all showtimes at once

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Showtimes                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Movie:    [Movie A                           ▼]                │
│                                                                 │
│  Dates:    [Feb 10, 2026] to [Feb 16, 2026]                     │
│                                                                 │
│  Times:    ☑ 14:00   ☑ 16:30   ☑ 18:00   ☑ 21:00              │
│                                                                 │
│  Price:    $[4.00] per seat                                     │
│                                                                 │
│  Preview:                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Feb 10: 14:00, 16:30, 18:00, 21:00                      │   │
│  │ Feb 11: 14:00, 16:30, 18:00, 21:00                      │   │
│  │ Feb 12: 14:00, 16:30, 18:00, 21:00                      │   │
│  │ ... (7 days × 4 times = 28 showtimes)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                        [Cancel]  [Create All]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Revenue Reports (`/admin/revenue`)

**Filters:**
- Date range
- Movie
- Payment method
- Cashier (for walk-in sales)

**Export:** CSV, PDF

**Metrics:**
- Total revenue
- Tickets sold
- Average ticket price
- Revenue by movie
- Revenue by payment method
- Promo code usage and discounts given

### Seat Configuration (`/admin/seats`)

Visual editor for seat layout:
- Drag to create rows
- Label seats (A1, A2, B1, B2...)
- Mark seats as: Available, Wheelchair, Blocked
- *Future: Set zones with different pricing*

---

## 10. Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Branch      │     │     Screen      │     │      Movie      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │────<│ branch_id       │     │ id              │
│ name            │     │ id              │     │ title_km        │
│ location        │     │ name            │     │ title_en        │
│ phone           │     │ seat_layout     │     │ title_cn        │
│ settings (JSON) │     │ (JSON)          │     │ poster_url      │
│ created_at      │     │ created_at      │     │ trailer_url     │
└─────────────────┘     └─────────────────┘     │ duration_min    │
                               │                │ genre           │
                               │                │ rating          │
                               │                │ subtitle_lang   │
                               │                │ synopsis_km     │
                               │                │ synopsis_en     │
                               │                │ synopsis_cn     │
                               │                │ release_date    │
                               │                │ status          │
                               │                │ created_at      │
                               │                └─────────────────┘
                               │                         │
                               ▼                         │
                        ┌─────────────────┐              │
                        │    Showtime     │◀─────────────┘
                        ├─────────────────┤
                        │ id              │
                        │ screen_id       │
                        │ movie_id        │
                        │ start_time      │
                        │ price           │
                        │ status          │
                        │ created_at      │
                        └─────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│    SeatHold     │   │     Booking     │   │    Customer     │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ id              │   │ id              │   │ id              │
│ showtime_id     │   │ showtime_id     │   │ phone           │
│ seats (JSON[])  │   │ customer_id     │──▶│ email           │
│ device_id       │   │ guest_phone     │   │ wallet_balance  │
│ expires_at      │   │ guest_email     │   │ loyalty_points  │
│ created_at      │   │ seats (JSON[])  │   │ created_at      │
└─────────────────┘   │ total_price     │   └─────────────────┘
       │              │ discount        │           │
       │ (auto-clean  │ promo_code      │           │
       │  on expire)  │ payment_method  │           ▼
       │              │ payment_ref     │   ┌─────────────────┐
       │              │ invoice_qr      │   │   WalletTx      │
       │              │ status          │   ├─────────────────┤
       │              │ checked_in_at   │   │ id              │
       │              │ checked_in_by   │   │ customer_id     │
       │              │ created_at      │   │ type            │
       │              └─────────────────┘   │ (credit/debit)  │
       │                     │              │ amount          │
       │                     │              │ reference       │
       │                     ▼              │ booking_id      │
       │              ┌─────────────────┐   │ created_at      │
       │              │      User       │   └─────────────────┘
       │              ├─────────────────┤
       │              │ id              │
       │              │ email           │
       │              │ phone           │
       │              │ name            │
       │              │ role            │
       │              │ (admin/cashier) │
       │              │ branch_id       │
       │              │ created_at      │
       │              └─────────────────┘
       │
       ▼
┌─────────────────┐
│   PromoCode     │
├─────────────────┤
│ id              │
│ code            │
│ discount_type   │
│ (percent/fixed) │
│ discount_value  │
│ max_uses        │
│ used_count      │
│ valid_from      │
│ valid_until     │
│ created_at      │
└─────────────────┘
```

### Key Design Decisions

| Field | Type | Purpose |
|-------|------|---------|
| `seat_layout` | JSON | Flexible layout definition for each screen |
| `seats` | JSON[] | Array of seat IDs (e.g., ["A5", "A6"]) |
| `SeatHold` | Table | Temporary holds, auto-cleaned on expiry |
| `invoice_qr` | Text | Encrypted booking data for verification |
| `settings` | JSON | Branch-specific config (timezone, currency, etc.) |

### Sample seat_layout JSON

```json
{
  "rows": [
    {"id": "A", "seats": 16, "type": "standard"},
    {"id": "B", "seats": 16, "type": "standard"},
    {"id": "C", "seats": 16, "type": "standard"},
    {"id": "D", "seats": 16, "type": "standard"},
    {"id": "E", "seats": 14, "type": "standard", "offset": 1},
    {"id": "F", "seats": 14, "type": "standard", "offset": 1},
    {"id": "G", "seats": 12, "type": "standard", "offset": 2},
    {"id": "H", "seats": 10, "type": "standard", "offset": 3}
  ],
  "blocked": ["A1", "A16", "H1", "H10"],
  "wheelchair": ["A2", "A15"]
}
```

---

## 11. Implementation Phases

### Phase 1: Pitch Demo (1-2 weeks)
> **Goal:** Impress the owner with a beautiful, interactive prototype

| Priority | Task | Status |
|----------|------|--------|
| P0 | Project setup (Next.js 16, Tailwind, Framer Motion) | ⬜ |
| P0 | Brand identity (colors, typography, logo placeholder) | ⬜ |
| P0 | Homepage with hero + movie grid (mocked data) | ⬜ |
| P0 | Movie detail page with trailer embed | ⬜ |
| P0 | Interactive seat picker (visual only, no real booking) | ⬜ |
| P0 | Smooth page transitions | ⬜ |
| P0 | Mobile responsive design | ⬜ |
| P0 | Language switcher (KH/EN/CN with mocked translations) | ⬜ |
| P1 | Basic admin panel layout (view-only) | ⬜ |
| P1 | SEO meta tags setup | ⬜ |

**Deliverable:** Demo website owner can interact with on phone/computer

---

### Phase 2: Core Booking (2-3 weeks)
> **Goal:** Real bookings work end-to-end

| Priority | Task | Status |
|----------|------|--------|
| P0 | Supabase setup (database, auth, realtime) | ⬜ |
| P0 | Movie CRUD with partner API integration | ⬜ |
| P0 | Showtime management | ⬜ |
| P0 | Real-time seat availability | ⬜ |
| P0 | Timed seat holds (2min/5min) | ⬜ |
| P0 | Seat gap validation | ⬜ |
| P0 | Payment gateway integration (your Python API) | ⬜ |
| P0 | E-ticket generation with QR | ⬜ |
| P0 | Guest checkout flow | ⬜ |
| P1 | Promo code system | ⬜ |
| P1 | Email confirmations | ⬜ |

**Deliverable:** Customers can book and pay online

---

### Phase 3: Staff Tools (1-2 weeks)
> **Goal:** Cashiers can operate daily

| Priority | Task | Status |
|----------|------|--------|
| P0 | Staff authentication (admin/cashier roles) | ⬜ |
| P0 | Cashier dashboard | ⬜ |
| P0 | QR scanner verification | ⬜ |
| P0 | Walk-in ticket sales | ⬜ |
| P0 | Print ticket integration | ⬜ |
| P1 | Booking modifications (change seats/time) | ⬜ |
| P1 | Daily sales summary | ⬜ |

**Deliverable:** Cashiers can sell, verify, and manage tickets

---

### Phase 4: Customer Accounts (1-2 weeks)
> **Goal:** Wallet and loyalty system

| Priority | Task | Status |
|----------|------|--------|
| P0 | Phone OTP authentication | ⬜ |
| P0 | Customer account page | ⬜ |
| P0 | Wallet top-up (Bakong, Visa, cash) | ⬜ |
| P0 | Wallet payment at checkout | ⬜ |
| P0 | Booking history | ⬜ |
| P0 | My tickets view | ⬜ |
| P1 | Loyalty points earning | ⬜ |

**Deliverable:** Customers can create accounts and use wallet

---

### Phase 5: Analytics (1-2 weeks)
> **Goal:** Full admin insights

| Priority | Task | Status |
|----------|------|--------|
| P0 | Revenue dashboard | ⬜ |
| P0 | Daily/weekly/monthly reports | ⬜ |
| P0 | Export to CSV/PDF | ⬜ |
| P1 | Seat heatmap | ⬜ |
| P1 | Peak hours analysis | ⬜ |
| P1 | Movie performance ranking | ⬜ |
| P2 | Forecasting | ⬜ |

**Deliverable:** Admin has full visibility into business

---

## 12. Future Considerations

Features to potentially add later:

### F&B Add-ons
- Popcorn, drinks, combos
- Add to cart on payment page
- Pick up at counter or seat delivery

### Zone Pricing
- Different prices for front/middle/back
- VIP seats, couple seats

### Multi-Branch Support
- Multiple locations under one system
- Branch-specific movies and showtimes
- Consolidated reporting

### Mobile App
- Native iOS/Android app
- Push notifications for reminders
- Faster checkout with saved payment

### Membership Tiers
- Bronze, Silver, Gold levels
- Tier-based discounts
- Early booking access

### Integration with Distributor Systems
- Automatic movie schedule updates
- Box office reporting

---

## Appendix: Design References

Inspired by (but more modern than):
- Legend Cinema (legend.com.kh) - UX flow, seat picker
- Major Cineplex (majorcineplex.com) - Dark theme, gold accents
- Prime Cineplex (primecineplex.com) - Layout structure
- Fandango (fandango.com) - Clean movie grid, minimal UI

**Target:** Combine the cinematic feel of Cambodian cinema sites with the clean, modern UX of US booking platforms. Mobile-first, Khmer-first, smooth animations throughout.

---

*Document created: February 9, 2026*
*Last updated: February 9, 2026*
