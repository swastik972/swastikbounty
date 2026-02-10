# Firebase Deployment Guide for Main Folder

## Project Structure
```
Mini-Hackthon/
├── functions/                    # Firebase Cloud Functions (Backend)
│   ├── index.js                 # Express app as Cloud Function
│   └── package.json
├── main/
│   ├── backend/                 # Local development backend
│   │   ├── server.js
│   │   └── package.json
│   └── frontend/                # Next.js frontend
│       ├── src/
│       ├── package.json
│       └── next.config.mjs       # Configured for static export
├── firebase.json                # Firebase config
└── .firebaserc                  # Firebase project settings
```

## Prerequisites

1. **Firebase Account**: Create one at https://console.firebase.google.com
2. **Firebase Project**: Create a new project in Firebase Console
3. **Firebase CLI**: 
   ```bash
   npm install -g firebase-tools
   ```
4. **Login to Firebase**:
   ```bash
   firebase login
   ```

## Setup

### 1. Update Project ID
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "YOUR-PROJECT-ID-HERE"
  }
}
```

### 2. Install Dependencies
```bash
# Install functions dependencies
cd functions
npm install

# Install frontend dependencies
cd ../main/frontend
npm install
```

### 3. Configure Frontend API Base URL
For **local development**, use `http://localhost:5000` in `main/frontend/.env.local`

For **production (Firebase)**, the frontend will call the Cloud Functions API at:
`https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/api`

## Deployment

### Option 1: Using the Script (Easiest)
```bash
.\deploy-firebase.bat
```

### Option 2: Manual Deployment

**1. Build frontend:**
```bash
cd main/frontend
npm run build
```

**2. Deploy to Firebase:**
```bash
cd ../..
firebase deploy
```

## What Gets Deployed

- **Backend**: Express app runs as Cloud Function at `/api` endpoint
- **Frontend**: Static files from `main/frontend/out/` deployed to Firebase Hosting
- **Rewrites**: All `/api/**` requests are routed to the Cloud Function

## Available Endpoints

After deployment, your endpoints will be at:
- Frontend: `https://your-project-id.web.app`
- API: `https://region-your-project-id.cloudfunctions.net/api`

### Endpoints:
- `POST /api/certificate/issue` - Issue a certificate
- `POST /api/certificate/revoke` - Revoke a certificate
- `GET /api/certificate/verify/:address` - Verify a certificate
- `GET /api/certificates` - Get all certificates
- `GET /api/health` - Health check

## Updating API Base URL for Production

After deployment, update the frontend to use the Cloud Functions URL:

1. Find the backend API URL from Firebase Console → Functions
2. Update frontend code or environment variables to use the new URL
3. Rebuild and redeploy

## Local Development

### Backend (Local):
```bash
cd main/backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend (Local):
```bash
cd main/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

Frontend is configured to use `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000` for local development.

## Troubleshooting

**"Permission denied" errors:**
```bash
firebase logout
firebase login
firebase deploy
```

**"Out of space" errors:**
- Delete node_modules and reinstall
- Clean up old build artifacts

**API not responding:**
- Check Cloud Functions logs in Firebase Console
- Verify environment variables are set correctly
- Check that CORS is configured properly

## Reverting Changes

To go back to local development only:
```bash
# Stop using Firebase
rm -r functions/
rm firebase.json .firebaserc
cd main/backend && npm run dev
```
