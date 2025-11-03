# SmartCityFix – Urban Issue Reporting & Resolution Platform

Monorepo structure:

- /backend – Node.js + Express + MongoDB + Socket.IO
- /frontend – React + Vite + Tailwind + ShadCN + Socket.IO client + Recharts + PWA

## Getting Started (Local)

### Backend
```
cd backend
cp env.sample .env  # fill values
npm install
npm run dev
```

### Frontend
```
cd frontend
# copy ENV.EXAMPLE.txt to .env.local and set vars
npm install
npm run dev
```

Open http://localhost:5173

## Environment
- Frontend:
  - VITE_API_BASE=http://localhost:4000/api
  - VITE_SOCKET_URL=http://localhost:4000
  - VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
- Backend:
  - PORT=4000
  - CLIENT_ORIGIN=http://localhost:5173
  - MONGO_URI, JWT_SECRET
  - Optional: Cloudinary + Email credentials

## Build & Deploy
- Backend (Render): set env vars, enable WebSockets, Start: `npm start`
- Frontend (Vercel): set env vars, build via Vercel

PWA:
- Manifest and service worker included; SW registers on production build.
