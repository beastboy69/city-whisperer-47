# SmartCityFix Frontend

Tech: React + Vite + Tailwind + ShadCN/UI + Axios + Socket.IO client + Recharts

## Setup

1) Create `.env.local` (see ENV.EXAMPLE.txt):

```
VITE_API_BASE=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

2) Install and run

```
npm install
npm run dev
```

## Cloudinary Upload Widget
- We include the Cloudinary widget script in `index.html`.
- Set `VITE_CLOUDINARY_CLOUD_NAME` to enable the widget in the Report page.
- For production, prefer a signed preset or server-side signed uploads.

## PWA
- Manifest at `public/manifest.json` and basic service worker at `public/service-worker.js`.
- SW registers automatically in production build.

Build and preview production:
```
npm run build
npm run serve
```

## Theming
- ThemeProvider stores theme in localStorage and toggles `.dark` class.
- Brand colors:
  - Citizen primary: Sky Blue #00B4D8
  - Admin primary: Navy Blue #023E8A
