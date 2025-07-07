# Mood Tracking App

A beautifully structured and user-friendly mood tracking application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **React Context**. The app allows users to log their mood, feelings, journal entries, and sleep duration using a multi-step form flow.

---

## 🧠 Features

- Multi-step form with:
  - Mood selection
  - Feelings tagging
  - Journal entry
  - Sleep hours input
- Context-based state management
- Form validation
- Beautiful UI with Tailwind
- Unit + Integration tests using Vitest + RTL

---

## 📁 Folder Structure

```
app/
├── (auth)/                  # Auth-related routes and components
├── (protected)/             # Protected routes after login
│   ├── _components/         # UI Steps: Mood, Feelings, Journal, Sleep
│   ├── _context/            # `useLogMoodContext` context definition
│   ├── _services/           # API service calls (fetching/updating mood data)
│   ├── layout.tsx           # Shared layout for protected routes
│   ├── page.tsx             # Log mood entry point
│   └── utils.ts             # Shared constants (MOODS_CONFIG, FEELING_TAGS, etc.)
components/
└── ui/                      # Reusable UI components (Avatar, Button, ErrorMessage, etc.)
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file and add required keys:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Testing

This project uses:

- [`Vitest`](https://vitest.dev/)
- [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/)

### Run tests

```bash
npm run test
```

Tests are located in `__test__/` and include coverage for:

- MoodStep
- FeelingsStep
- JournalStep
- Context mocking
- Error message rendering

---

## 📂 Tests (Vitest)

Tests are written for each step component:

- **Mocking context with `useLogMoodContext`**
- **Interacting with form elements**
- **Asserting state updates and validation errors**

Example (MoodStep):
```ts
fireEvent.click(screen.getByText("Happy"))
expect(mockSetMood).toHaveBeenCalledWith(2)
```

---

## ✨ Author

Made by Soufiane Oualla — Frontend Developer  
For questions or contributions, feel free to open an issue or contact directly.

---

## 📝 License

MIT
