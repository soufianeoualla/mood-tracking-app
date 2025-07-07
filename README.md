# 🧠 Mood Tracking App

> A beautifully crafted mood tracking application that helps users monitor their emotional well-being through an intuitive multi-step interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Hono](https://img.shields.io/badge/Hono-API-orange?style=flat-square)

## ✨ Features

- **🎯 Multi-Step Form Flow**

  - Mood selection with visual indicators
  - Feelings tagging system
  - Personal journal entries
  - Sleep duration tracking

- **🔐 Authentication System**

  - Secure login/signup flow
  - Password reset functionality
  - Email verification
  - Protected routes

- **🤖 AI-Powered Features**

  - Daily motivational quotes via Gemini AI

- **⚡ Modern Tech Stack**

  - Next.js 14 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - React Context for state management
  - Hono-powered API backend

- **🧪 Comprehensive Testing**
  - Unit tests with Vitest
  - Integration tests with React Testing Library
  - Component coverage for all form steps

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Database (PostgreSQL/MySQL)

### Installation

1. **Clone the repository**

   ```bash
   git clone <https://github.com/soufianeoualla/mood-tracking-app>
   cd mood-tracking-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file:

   ```bash
   # Database
   DATABASE_URL="your-database-url"

   # App Configuration
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"

   # Cloudinary (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

   # Email Service
   RESEND_API_KEY="your-resend-api-key"

   # AI Integration
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
mood-tracking-app/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify/
│   ├── (protected)/               # Protected application routes
│   │   ├── _components/           # Mood tracking form components
│   │   ├── _context/              # Context providers
│   │   ├── _services/             # API service layer
│   │   ├── onboarding/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                       # API routes (Hono)
│   │   ├── auth.route.ts
│   │   ├── mood-entry.route.ts
│   │   ├── onboarding.route.ts
│   │   └── profile.route.ts
│   └── layout.tsx
├── components/
│   └── ui/                        # Reusable UI components
├── lib/                           # Utility functions
├── prisma/                        # Database schema & migrations
├── public/                        # Static assets
└── __tests__/                     # Test files
```

## 🧪 Testing

Run the comprehensive test suite:

````bash
# Run all tests
npm run test

### Test Coverage

#### 🧪 Component Tests
- ✅ **Avatar Component** (`avatar.test.tsx`) - User avatar display and fallbacks
- ✅ **Button Component** (`button.test.tsx`) - Button variants and interactions
- ✅ **Profile Form** (`profile-form.test.tsx`) - User profile management

#### 📝 Form Step Tests
- ✅ **Mood Step** (`mood-step.test.tsx`) - Mood selection logic and validation
- ✅ **Feelings Step** (`feeling-step.test.tsx`) - Multi-select feelings functionality
- ✅ **Journal Step** (`journal-step.test.tsx`) - Text input validation and character limits
- ✅ **Sleep Step** (`sleep-step.test.tsx`) - Sleep hours selection, option rendering, and error validation

## 🔧 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/login                     # User login
POST /api/auth/signup                    # User registration
POST /api/auth/forgot-password           # Password reset request
POST /api/auth/reset-password            # Password reset confirmation
GET  /api/auth/verify                    # Email verification
````

### Mood Tracking Endpoints

```typescript
POST /api/mood-entry          # Create daily mood entry with AI-generated quote
GET  /api/mood-entry          # Get today's mood entry
GET  /api/mood-entry/average  # Get mood/sleep averages with trend analysis
GET  /api/mood-entry/chart    # Get 11-day chart data for mood visualization

```

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build production version
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run test suite
```

## 📱 Features Walkthrough

1. **User Registration** - Create account with email verification
2. **Onboarding** - Set up user preferences
3. **Daily Mood Logging** - Track mood, feelings, journal, and sleep
4. **Dashboard** - View mood trends and insights
5. **Profile Management** - Update personal information


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Soufiane Oualla**  
Frontend Developer

- GitHub: [@soufiane-oualla](https://github.com/soufiane-oualla)
- LinkedIn: [Soufiane Oualla](https://linkedin.com/in/soufianeoualla)

---

<div align="center">
  <p>Built with ❤️ using Next.js and TypeScript</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
