# Blog App - Frontend

A blogging platform frontend built with React, Vite and Tailwind CSS. Includes user authentication, role-based access control, and article management for Users, Authors, and Admins.

---

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Tech Stack

- **React** — UI library
- **Vite** — Build tool & dev server
- **React Router** — Routing
- **Tailwind CSS** — Utility-first styling
- **Zustand** — State management
- **Axios** — HTTP client
- **React Hook Form** — Form handling
- **React Hot Toast** — Notifications

---

## Project Structure

```
src/
├── components/      # React components (Header, Footer, Pages...)
├── Rstore/          # Zustand auth store
├── Styles/          # Styling utilities
├── assets/          # Images & fonts
├── App.jsx          # Root component
└── main.jsx         # Entry point
```

---

## User Roles & Features

- **User** — Read articles, manage profile
- **Author** — User features + create/edit articles
- **Admin** — Full access including content moderation

---

## API Configuration

- **Backend URL:** https://week5-capstone.onrender.com
Main endpoints used by the frontend:

- `POST /common-api/login` — Login
- `POST /common-api/register` — Register
- `GET /common-api/check-auth` — Verify session
- `GET /api/articles` — Get all articles
- `POST /api/articles` — Create article (Author/Admin)

Example frontend components referenced:

- `ArticleByID.jsx` — Single article view
- `AuthorArticles.jsx` — Author's article list
- `EditArticleForm.jsx` — Article editor
- `Header.jsx`, `Footer.jsx` — Layout
- `Home.jsx`, `Login.jsx`, `Register.jsx` — Pages


---

## Deployed Link

https://week5-capstone.vercel.app/
---

If you want, I can also:

- add usage examples for the API
- update `package.json` scripts or dependency versions
- run the dev server to verify locally