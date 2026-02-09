# DevTinder Deployment Guide

This repo contains the backend for DevTinder. The frontend is in `devTinder-web/`.

## Backend (Render)

### Environment variables
- `MONGO_URI` = MongoDB Atlas connection string
- `FRONTEND_URL` = Vercel frontend URL (e.g., `https://yourapp.vercel.app`)
- `PORT` = set automatically by Render

### Render settings
- Build Command: `npm install`
- Start Command: `node src/app.js`

### Health check
- `GET /health` should return `{ "status": "ok" }`

## Frontend (Vercel)

### Environment variables
- `VITE_BASE_URL` = Render backend URL (e.g., `https://your-api.onrender.com`)

### Build settings
- Build Command: `npm run build`
- Output Directory: `dist`

## Local Development

Backend:
- `MONGO_URI` must be set in your shell before running
- `npm run dev`

Frontend:
- `VITE_BASE_URL` is optional (defaults to `http://localhost:7777`)
