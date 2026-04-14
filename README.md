# Global Explorer - Full-Stack Country Discovery App

A polished, production-ready web application for exploring global data, built with React, Express, and the REST Countries API.

## 🌍 API Information & Source

The data for this application is powered by the **REST Countries API**. 

- **API Source**: We discovered this API through [dlthub's curated list of practice API sources](https://dlthub.com/blog/practice-api-sources).
- **Endpoint Used**: `https://restcountries.com/v3.1/`
- **Data Provided**: Comprehensive country information including flags, population, regions, languages, currencies, and geographic borders.

## 🏗️ Technical Architecture

The application uses a **Full-Stack (Express + Vite)** architecture to ensure high performance and bypass browser-level restrictions.

### 1. Backend (Express Server)
Located in `server.ts`, the backend serves two critical purposes:
- **API Proxying**: It acts as a bridge between the frontend and the REST Countries API. This resolves **CORS (Cross-Origin Resource Sharing)** issues that typically occur when calling public APIs directly from a browser.
- **Request Optimization**: The server handles the logic for filtering fields and managing complex queries for bordering countries.

### 2. Frontend (React + Vite)
Built with React 18, the frontend focuses on a "Mood First" design philosophy:
- **Tailwind CSS**: For utility-first, responsive styling.
- **shadcn/ui**: For polished, accessible components like Dialogs, Inputs, and Skeletons.
- **Motion (Framer Motion)**: For smooth transitions and staggered entrance animations.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library with functional components and hooks.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **shadcn/ui**: High-quality, accessible UI components (Dialog, Input, Badge, ScrollArea, Skeleton).
- **Motion (Framer Motion)**: For fluid layout animations and staggered entrances.
- **Lucide React**: Beautiful, consistent icon set.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Fast, unopinionated web framework for the API proxy.
- **tsx**: TypeScript execution engine for running the server directly.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

---

## 📂 Project Structure & File Flow

### Core Files
- `server.ts`: The entry point for the entire application. It handles API proxying, CORS, and serves the frontend.
- `package.json`: Manages scripts and dependencies. The `dev` script runs `tsx server.ts`.
- `index.html`: The root HTML template for the Vite frontend.

### Frontend Flow (`/src`)
- `main.tsx`: Bootstraps the React application.
- `App.tsx`: The main layout component. Manages global state (countries list, search, filters, selected country).
- `types.ts`: Centralized TypeScript interfaces for the Country data model.

### Logic & Services (`/src/lib`)
- `api.ts`: The frontend API client. It communicates with our local Express backend instead of calling the external API directly.
- `utils.ts`: Contains the `cn()` helper for dynamic Tailwind class merging.

### Components (`/src/components`)
1. **`CountryCard.tsx`**: Displays a summary of a country in the grid.
2. **`CountryDialog.tsx`**: The detailed view. Handles border country fetching and image preloading.
3. **`RegionFilter.tsx`**: Custom dropdown for continent-based filtering.

### UI Components (`/components/ui`)
- Reusable, low-level components from **shadcn/ui** (e.g., `button.tsx`, `dialog.tsx`, `skeleton.tsx`).

---

## 🔄 Application Flow

### 1. Initial Discovery
- On load, the app fetches all countries via the backend proxy (`/api/countries`).
- To optimize performance, we only request the specific fields needed for the grid view (name, flags, region, population, capital, cca3).
- **Skeleton States**: Users see a shimmering loading state while data is being fetched.

### 2. Search & Filter
- **Real-time Search**: Users can search by country name or capital city.
- **Region Filtering**: A custom dropdown allows users to narrow down countries by continent.
- **Optimized Filtering**: All filtering is done in-memory using `useMemo` for sub-millisecond responsiveness.

### 3. Detailed Exploration
- Clicking a country card opens a **Backdrop-blurred Dialog**.
- **Deep Data Fetching**: The app fetches extended details (TLD, currencies, maps) only when a country is selected.
- **Border Navigation**: Bordering countries are displayed as interactive badges.

### 4. Performance Optimizations
- **Image Preloading**: When a country dialog opens, the app automatically pre-caches the flag images of all bordering countries. This ensures that clicking a neighbor results in an **instant** transition with no image pop-in.
- **Retry Logic**: The API client includes a robust retry mechanism to handle intermittent network issues gracefully.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```
