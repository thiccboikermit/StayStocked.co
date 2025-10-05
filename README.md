# 🏠 StayStocked - Airbnb Grocery Stocking Platform

StayStocked is a comprehensive platform that connects Airbnb hosts, guests, and stockers to provide seamless grocery stocking services for vacation rentals.

## Features

- **Multi-Portal Architecture**: Separate interfaces for hosts, guests, stockers, and admins
- **Host Dashboard**: Property management, order approval, calendar sync
- **Guest Experience**: AI meal planning and manual grocery shopping
- **Stocker Portal**: Job management and order fulfillment
- **Authentication**: Secure login with password reset functionality
- **Payment Integration**: Stripe for secure transactions
- **Database**: PostgreSQL with Prisma ORM
- **Deployment Ready**: Optimized for Vercel deployment

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   ├── signin/                 # Sign in page
│   │   └── forgot-password/        # Password reset
│   ├── host/
│   │   ├── register/               # Host registration
│   │   └── page.tsx               # Host dashboard
│   ├── guest/
│   │   └── [propertyId]/          # Guest property page
│   ├── stocker/
│   │   └── page.tsx               # Stocker dashboard
│   └── admin/                      # Admin panel (future)
├── components/                     # Reusable UI components
├── lib/                           # Utility functions and config
└── types/                         # TypeScript type definitions
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Nodemailer (for password reset)
- **Deployment**: Vercel
- **UI Components**: Heroicons, Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd staystocked
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your database URL, Stripe keys, and other required credentials.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: Hosts, stockers, and admins with role-based access
- **Property**: Rental properties with calendar sync
- **Order**: Guest grocery orders with status tracking
- **StockerProfile**: Extended stocker information and ratings

Key features:
- Password reset functionality with secure tokens
- Calendar integration for booking sync
- Flexible JSON storage for grocery items and amenities
- Photo uploads for stocking confirmation

## Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Required Environment Variables for Production:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=random-secret-string
NEXTAUTH_URL=https://your-domain.vercel.app
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## API Routes

The application will include the following API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/properties` - List properties
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `POST /api/stripe/webhook` - Stripe webhook handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for the future of vacation rental hosting.
