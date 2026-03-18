# Frontend Deployment Guide

## Demo URL
- **Live Frontend**: https://buysimpl.netlify.app

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd buy-simply
npm install
```

### Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5173`

### Build
```bash
npm run build
```

## Connecting to Backend API

The frontend needs to connect to your NestJS backend API. There are two ways to configure this:

### Development (Local)
The `.env.local` file is configured to use `http://localhost:3000` by default.

```bash
# Start backend
cd buy-simply/backend
npm run start:dev

# In another terminal, start frontend
cd buy-simply
npm run dev
```

### Production (Netlify)
To connect to your deployed backend:

1. Update `.env.production` with your backend URL:
```env
VITE_API_URL=https://your-backend-api.com
```

2. Commit and push:
```bash
git add .env.production
git commit -m "Update backend API URL"
git push
```

Netlify will automatically rebuild and redeploy.

## Login Credentials (for testing)

Use these credentials to test the login:

- **SuperAdmin**
  - Email: `edwinjohn@example.com`
  - Password: `12345Pass`

- **Admin**
  - Email: `jp@example.com`
  - Password: `1234567Pass`

- **Staff**
  - Email: `ladam@example.com`
  - Password: `123456789Pass`

## Features
- ✅ Responsive login page
- ✅ JWT authentication
- ✅ Error handling with user feedback
- ✅ Form validation
- ✅ Remember me option
- ✅ Loading states

## Troubleshooting

### Login fails with CORS error
Ensure the backend CORS is configured to allow the frontend domain:
```env
CORS_ORIGIN=https://buysimpl.netlify.app
```

### API calls failing
Check that:
1. Backend is running on the configured API URL
2. VITE_API_URL environment variable is set correctly
3. Network tab in browser DevTools to see the actual requests
