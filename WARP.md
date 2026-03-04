# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

StayStocked is a Next.js 15 application connecting Airbnb hosts, guests, and stockers for grocery stocking services. It uses a multi-portal architecture with role-based access for hosts, guests, stockers, and admins.

**Tech Stack:**
- Next.js 15 (App Router), React 19, TypeScript
- Prisma ORM with PostgreSQL
- NextAuth.js for authentication
- Stripe for payments
- Tailwind CSS 4 for styling
- Zod for validation

## Common Development Commands

### Setup & Database
```bash
# Install dependencies
npm install

# Database setup (first time)
npx prisma migrate dev
npx prisma generate

# After schema changes
npx prisma migrate dev --name <migration-name>
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Development & Testing
```bash
# Start development server
npm run dev

# Production build & start
npm run build
npm start

# Linting
npm run lint
```

### Prisma Tips
- Always run `npx prisma generate` after pulling schema changes
- Use `npx prisma migrate dev` for development migrations
- Use `npx prisma migrate deploy` for production deployments

## Architecture

### Multi-Portal System

The app has four distinct user portals accessed via URL-based routing:

1. **Host Portal** (`/host/*`) - Property and order management
2. **Guest Portal** (`/guest/*`) - Browse and order groceries
3. **Stocker Portal** (`/stocker/*`) - Claim and fulfill orders
4. **Admin Portal** (`/admin/*`) - Platform oversight

Each portal has its own authentication flow and UI patterns.

### Guest Link System

Guests access properties via **unique booking links** generated from iCal calendar sync:
- Format: `/guest/{slug}?stay={dates}&booking={id}&property={id}`
- Links are auto-generated when host syncs Airbnb/VRBO calendars
- Shopping process uses slug-based URLs: `/shop/{property-slug}-{id}`

### Data Flow Architecture

**Property → Booking → Order → Stocker → Completion**

1. Host adds property with iCal URL
2. System syncs calendar, creates bookings
3. Host generates guest links for bookings
4. Guest places order (pending → confirmed after payment)
5. Stocker claims order (confirmed → shopping)
6. Stocker completes with photos (shopping → delivered)

### Storage Strategy

**Development:** Uses `src/lib/storage.ts` (localStorage wrapper) with TTL support
**Production:** Should use Prisma + PostgreSQL exclusively

Key storage functions in `src/lib/auth.ts`:
- Mock data functions (loadMockUsers, loadMockProperties, etc.)
- Replace these with Prisma queries when moving to production

### Key Library Files

**`src/lib/auth.ts`** - Core business logic
- User authentication & registration
- Property CRUD operations
- Booking management & guest link generation
- Order lifecycle management
- Stocker profile & statistics

**`src/lib/validation.ts`** - Zod schemas
- All data validation schemas (User, Property, Booking, Order)
- Input sanitization functions
- Rate limiting utilities

**`src/lib/storage.ts`** - Secure localStorage wrapper
- TTL support for cached data
- Auto-cleanup of expired items
- Type-safe get/set operations

**`src/lib/performance.ts`** - Performance monitoring
- Core Web Vitals tracking
- Component performance timers
- Error categorization & logging

**`src/lib/groceries.ts`** - Shopping logic
- AI meal planning integration
- Manual shopping flow
- Cart management

**`src/lib/ical.ts`** - Calendar sync
- iCal URL parsing
- Booking extraction from calendar events

## Database Schema (Prisma)

### Core Models

**User** - Multi-role support (HOST, STOCKER, ADMIN)
- Password reset functionality via `resetToken`
- Relations to properties, orders, and stocker profiles

**Property** - Rental listings
- Stores JSON for amenities
- Optional iCal sync via `icalUrl`
- Tracks last calendar refresh

**Order** - Guest grocery orders
- Status flow: PENDING → APPROVED → ASSIGNED → IN_PROGRESS → STOCKED → CANCELLED
- JSON storage for grocery items
- Stocker assignment and photo uploads

**StockerProfile** - Extended stocker info
- Service radius, vehicle info, ratings
- Completed order tracking

### Important Relationships
- User (host) → Property (one-to-many)
- Property → Order (one-to-many)
- User (stocker) → Order (one-to-many via stockerId)
- User (stocker) → StockerProfile (one-to-one)

## API Route Patterns

All API routes follow Next.js App Router conventions in `src/app/api/`:

**Order Management:**
- `GET /api/orders/available` - List available orders for stockers
- `POST /api/orders/claim` - Stocker claims an order
- `POST /api/orders/complete` - Complete order with photos
- `GET /api/orders/guest/[guestId]` - Guest's orders
- `GET /api/orders/stocker/[stockerId]` - Stocker's orders

**Payment:**
- `POST /api/create-payment-intent` - Create Stripe PaymentIntent

### API Response Pattern
```typescript
// Success
{ success: true, data: {...}, message?: string }

// Error
{ error: string, details?: string }
```

## Authentication & Authorization

**Current State:** Mock authentication in `src/lib/auth.ts`
- Cookie-based auth token (base64 encoded user object)
- Role stored in token for portal access control

**Production Migration:** Implement NextAuth.js
- Prisma adapter already in schema
- Use `@next-auth/prisma-adapter`
- Configure providers in `src/app/api/auth/[...nextauth]/route.ts`

### Role-Based Access
```typescript
// Check functions
isAdmin(user) // Admin-only features
isHost(user)  // Host portal
isStocker(user) // Stocker portal
```

## Stripe Integration

**Status:** UI ready, backend pending full integration

**Setup Steps** (see STRIPE_INTEGRATION.md):
1. Add Stripe keys to `.env`
2. Uncomment Stripe code in `/api/create-payment-intent/route.ts`
3. Create webhook handler at `/api/webhooks/stripe/route.ts`
4. Integrate `@stripe/react-stripe-js` components

**Order Payment Flow:**
1. Guest completes cart → creates order (status: pending)
2. Frontend calls `/api/create-payment-intent`
3. Guest completes Stripe checkout
4. Webhook updates order to "confirmed"
5. Order becomes available for stockers

## Environment Variables

Required for development (.env):
```
DATABASE_URL - PostgreSQL connection string
NEXTAUTH_SECRET - Random secret for NextAuth
NEXTAUTH_URL - App URL (http://localhost:3000)
STRIPE_PUBLIC_KEY - Stripe publishable key
STRIPE_SECRET_KEY - Stripe secret key
STRIPE_WEBHOOK_SECRET - Stripe webhook signing secret
```

Optional:
```
GOOGLE_CLIENT_ID - OAuth
GOOGLE_CLIENT_SECRET - OAuth
SMTP_* - Email service for password reset
```

## Code Patterns & Conventions

### Component Structure
- Client components: `'use client'` directive at top
- Server components: default (no directive)
- Use async server components for data fetching when possible

### Import Aliases
- `@/` maps to `src/`
- Example: `import { storage } from '@/lib/storage'`

### Error Handling
```typescript
// Use error handling utilities
import { logNetworkError, logValidationError } from '@/lib/errorHandling';

try {
  await riskyOperation();
} catch (error) {
  logNetworkError(error, 'ComponentName', { context });
}
```

### Validation Pattern
```typescript
import { validateEmail } from '@/lib/validation';

if (!validateEmail(input)) {
  // Handle invalid input
}
```

### Storage Pattern
```typescript
import { storage, StorageKeys } from '@/lib/storage';

// Set with TTL
storage.set(StorageKeys.CART, cart, { ttl: 24 * 60 * 60 * 1000 });

// Get with default
const cart = storage.get(StorageKeys.CART, []);
```

## Performance Optimizations

See OPTIMIZATIONS.md for comprehensive details. Key points:

- **Bundle size:** ~102KB shared JS, optimized for Core Web Vitals
- **Lazy loading:** Use `next/dynamic` for heavy components
- **Performance monitoring:** Built-in via `src/lib/performance.ts`
- **Memory management:** Auto-cleanup in storage.ts

### Performance Monitoring
```typescript
import { performanceMonitor } from '@/lib/performance';

// Track operation timing
performanceMonitor.startTiming('operation');
// ... code
performanceMonitor.endTiming('operation');
```

## Testing Approach

**Current State:** No formal test suite

**When Adding Tests:**
- Use Next.js testing conventions (Jest + React Testing Library)
- Test validation schemas in `src/lib/validation.ts`
- Mock Prisma client for database tests
- Test API routes with `next/server` mocks

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Configure environment variables in Vercel dashboard
3. Set `DATABASE_URL` to production PostgreSQL instance
4. Run migrations: `npx prisma migrate deploy`
5. Auto-deploys on push to main

**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)

## Migration from Mock to Production

To move from localStorage mocks to real database:

1. **Replace storage calls in `src/lib/auth.ts`:**
   - `loadMockUsers()` → Prisma User queries
   - `loadMockProperties()` → Prisma Property queries
   - `loadMockOrders()` → Prisma Order queries

2. **Implement NextAuth.js:**
   - Create `/api/auth/[...nextauth]/route.ts`
   - Use Prisma adapter
   - Configure session strategy

3. **Update API routes:**
   - Add authentication checks
   - Use Prisma client instead of mock functions

4. **Environment setup:**
   - Configure production DATABASE_URL
   - Run `npx prisma migrate deploy`

## Common Issues

**Prisma Client Not Generated:**
```bash
npx prisma generate
```

**Database Out of Sync:**
```bash
npx prisma migrate reset  # Dev only - destroys data!
npx prisma migrate deploy # Production safe
```

**Build Errors on Windows:**
- Ensure line endings are set to LF in Git config
- Use PowerShell or Git Bash for Prisma commands

**Type Errors After Schema Changes:**
1. Run `npx prisma generate`
2. Restart TypeScript server in editor

## Guest Shopping Flow

1. Guest receives link from host: `/guest/{slug}?stay=...&booking=...&property=...`
2. System validates booking and dates
3. Guest chooses AI meal planning or manual shopping
4. AI flow: Collects preferences → generates meal plan → adds to cart
5. Manual flow: Browse categories → add items → cart
6. Checkout: Enter details → Stripe payment → order created
7. Order confirmation with tracking link

## Stocker Fulfillment Flow

1. Stocker views available orders (`/stocker/orders`)
2. Claims order (status: confirmed → shopping)
3. Purchases groceries and delivers to property
4. Uploads completion photos
5. Marks complete (status: shopping → delivered)
6. Stats update (completed orders count, rating)

## Host Property Management

1. Add property with details and iCal URL
2. System syncs calendar → creates bookings
3. Host views bookings and generates guest links
4. Host approves/manages orders for their properties
5. Host can manually refresh calendar sync
6. Edit property details or delete property

## Important Notes

- **iCal Sync:** Refresh rate is configurable (default: 1 hour between syncs)
- **Guest Links:** Unique per booking, include date validation
- **Order Status:** Always update via helper functions in `auth.ts` to maintain consistency
- **Photos:** Stocker photos stored as string array (URLs or base64)
- **Ratings:** Simple averaging in stocker profile, can be enhanced
- **Rate Limiting:** Basic implementation in `validation.ts` - enhance for production

## Additional Documentation

- **README.md** - Project setup and overview
- **OPTIMIZATIONS.md** - Performance improvements and metrics
- **STRIPE_INTEGRATION.md** - Payment integration guide
- **prisma/schema.prisma** - Database schema with comments
