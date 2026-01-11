# Deployment Guide

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas (or local MongoDB)
- Google Gemini API Key

## Backend (Server)

1. **Environment Variables**
   Set the following in your deployment environment (e.g., Render, Heroku, Railway):
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/news-db
   GEMINI_API_KEY=your_gemini_key
   PORT=5000
   ```

2. **Build & Start**
   - Install dependencies: `npm install`
   - Start: `npm start` (or `node index.js`)

3. **Endpoints**
   - `GET /` - Health check
   - `GET /api/articles` - List articles
   - `POST /api/articles/scrape` - Trigger scraper (use a cron job to hit this periodically)

## Frontend (Client)

1. **Environment Variables**
   Creating a `.env` in `client` is optional if hardcoding the API URL, but recommended:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   *Note: You might need to update `client/src/api.js` to use this variable.*

2. **Build**
   - Run `npm run build`
   - This produces a `dist` folder.

3. **Deploy**
   - Drag and drop the `dist` folder to Netlify, or connect your repo to Vercel.
   - For Vercel, set the "Output Directory" to `dist`.

## Local Development
1. Start Backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. Start Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
