SmartCityFix Backend

Setup

1) Copy env.sample to .env and fill values
   - PORT=4000
   - CLIENT_ORIGIN=http://localhost:5173 (Vercel URL in prod)
   - MONGO_URI=your_mongodb_atlas_uri
   - JWT_SECRET=replace_with_long_secret
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (optional for local dev)
   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (optional)

2) Install and run

   npm install
   npm run dev

Key Endpoints

- Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- Issues: POST /api/issues, GET /api/issues/all, GET /api/issues/user, PATCH /api/issues/:id/status, DELETE /api/issues/delete/:id
- Feedbacks: POST /api/feedbacks/:issueId
- Analytics: GET /api/analytics/overview

Socket.IO

- Client events: join { userId }, watch-issue { issueId }, join-admin
- Server emits: "statusUpdate" { issueId, newStatus }, "newIssue" { issueId, type, createdAt }

Deploy

- Render: Node server start command: npm start, add env vars, allow WebSocket
- Vercel frontend (located at /frontend): set VITE_API_BASE=https://your-backend.onrender.com/api and VITE_SOCKET_URL=https://your-backend.onrender.com

Frontend env (create /frontend/.env.local):

VITE_API_BASE=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here


