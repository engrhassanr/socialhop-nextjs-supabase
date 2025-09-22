# Cloudinary Setup Guide

## Issue: Profile Banner Cannot Be Edited

The profile banner editing functionality is not working because Cloudinary environment variables are not configured.

## Solution Steps:

### 1. Create Environment File

Create a `.env.local` file in the project root with the following content:

```env
# Cloudinary Configuration
# Get these values from your Cloudinary dashboard: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 2. Get Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. Copy the following values from your dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. Update Environment File

Replace the placeholder values in `.env.local` with your actual Cloudinary credentials.

### 4. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## How Profile Banner Editing Works:

1. **User clicks edit button** on their profile banner
2. **File selection dialog** opens for image upload
3. **Image validation** checks file size (max 5MB) and type (images only)
4. **Upload to Cloudinary** via `/api/upload` route
5. **Database update** via `updateBanner` function
6. **UI updates** to show new banner

## Code Flow:

- **Frontend**: `sections/profile/ProfileHead.jsx` handles the UI and file selection
- **API Route**: `app/(app)/api/upload/route.js` handles Cloudinary upload
- **Server Action**: `actions/user.js` contains `updateBanner` function
- **Cloudinary Config**: `lib/cloudinary.js` configures the Cloudinary client

## Testing:

Once environment variables are set:

1. Go to your profile page
2. Click the edit button on the banner
3. Select an image file
4. The banner should update immediately

## Troubleshooting:

- Check browser console for errors
- Verify environment variables are loaded correctly
- Ensure Cloudinary account has sufficient storage/bandwidth
- Check file size is under 5MB limit
