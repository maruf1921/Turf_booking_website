# Football Turf Booking System

A modern, responsive web application for booking football turf slots. Built with React (Frontend) and Node.js/Express + SQLite (Backend).

## Features
- **Frontend**: Clean, sports-themed UI with a green/black palette, mobile responsive, smooth animations, dark mode toggle.
- **Backend**: RESTful API built with Express, storing data in SQLite. Features JWT-based authentication.
- **Functionality**: User login/signup, checking turf availability, booking time slots, user dashboard, admin panel.

## Prerequisites
- **Node.js**: v18 or higher (Download from [nodejs.org](https://nodejs.org/))
- **npm**: Node Package Manager (comes with Node.js)

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone or extract the project
Navigate to the root directory (`d:\tarf`). The project is split into two main folders: `frontend` and `backend`.

### 2. Backend Setup
The backend serves the REST API and interacts with the SQLite database.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
   *This installs `express`, `sqlite3`, `jsonwebtoken`, `bcrypt`, `cors`, and `dotenv`.*
3. Create a `.env` file in the `backend` directory with your secrets (optional, defaults are provided in the code for development):
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Or run `npm start` for production). The server will run on `http://localhost:5000` and automatically create the SQLite database file (`turf.db`).*

### 3. Frontend Setup
The frontend is a React application built with Vite.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
   *This installs React, React Router, Lucide Icons, etc.*
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The terminal will display a local URL (usually `http://localhost:5173`). Open this URL in your browser to view the application.

---

## 🛠 Deployment Guide

### Backend Deployment (e.g., Render, Railway, Fly.io)
1. Ensure your `.env` variables are configured in your hosting provider's dashboard (especially `JWT_SECRET`).
2. Your `package.json` must have a start script: `"start": "node server.js"`.
3. If deploying to a platform without persistent local storage (like Heroku), be aware that the SQLite database (`turf.db`) will be reset on every restart. For production on such platforms, consider migrating to PostgreSQL or MySQL, or use a persistent volume.
4. Deploy the `backend` folder to your chosen service.

### Frontend Deployment (e.g., Vercel, Netlify, GitHub Pages)
1. In the `frontend` directory, build the project for production:
   ```bash
   npm run build
   ```
2. This will generate a `dist` folder containing optimized HTML, CSS, and JS files.
3. If using Vercel or Netlify, simply connect your Git repository, set the root directory to `frontend`, and the build command to `npm run build` with the output directory as `dist`. The platform will handle the rest.
4. Ensure you update any API base URLs in the frontend code to point to your live backend URL (e.g., `https://your-backend.onrender.com/api`) instead of `http://localhost:5000/api`.

---

## Default Admin Credentials
To test the admin panel locally:
- Wait for the database to initialize; a default admin user will be created if none exists.
- Check the backend server logs for the default admin credentials, or sign up and modify the database directly to set `role = 'admin'`.
