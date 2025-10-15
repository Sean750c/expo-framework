# Google Authentication Setup

This guide explains how to set up Google OAuth authentication in the Cardify app.

## Features Implemented

The login screen now includes two Google sign-in methods:

1. **Authorization Code Flow** - Returns an authorization code that can be exchanged for tokens on the backend
2. **ID Token Flow** - Directly returns an ID token containing user information

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose application type based on your platform:
   - **Web application** for web testing
   - **iOS** for iOS builds
   - **Android** for Android builds

### 2. Configure Redirect URIs

For each platform, add the appropriate redirect URI:

#### Web
```
http://localhost:19006/redirect
```

#### iOS
```
cardify://redirect
```

#### Android
```
cardify://redirect
```

### 3. Update Client ID in Code

Open `/src/hooks/useGoogleAuth.ts` and replace the placeholder:

```typescript
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
```

### 4. Update app.json (iOS)

Add the URL scheme to your app.json:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.csdb.cardify",
      "supportsTablet": true
    },
    "scheme": "cardify"
  }
}
```

### 5. Update app.json (Android)

The scheme is already configured in app.json.

## How It Works

### Authorization Code Flow

1. User clicks "Sign in with Google (Code)"
2. Opens Google's OAuth consent screen
3. User approves permissions
4. Returns an authorization code
5. Code is logged to console (in production, send to backend to exchange for tokens)

**Console output:**
```
Authorization Code received: 4/0AY0e-g7...
Code Verifier: xyz123...
Redirect URI: cardify://redirect
```

### ID Token Flow

1. User clicks "Sign in with Google (ID Token)"
2. Opens Google's OAuth consent screen
3. User approves permissions
4. Returns an ID token
5. Token is decoded and logged to console

**Console output:**
```
ID Token received: eyJhbGciOiJSUzI1...
Decoded ID Token payload: {
  iss: "https://accounts.google.com",
  sub: "1234567890",
  email: "user@example.com",
  name: "John Doe",
  picture: "https://...",
  ...
}
```

## Testing

1. Start the development server: `npm run dev`
2. Open the app on your device or emulator
3. Navigate to the login screen
4. Click either Google sign-in button
5. Check the console for authentication results

## Security Notes

- The Authorization Code flow uses PKCE (Proof Key for Code Exchange) for additional security
- Never expose your Client Secret in the frontend code
- ID tokens should be validated on the backend before trusting the user information
- In production, always exchange authorization codes on the backend

## Integration with Backend

To integrate with your backend:

1. **For Authorization Code Flow:**
   - Send the code, code_verifier, and redirect_uri to your backend
   - Backend exchanges code for access_token and refresh_token
   - Backend validates tokens and creates user session

2. **For ID Token Flow:**
   - Send the id_token to your backend
   - Backend verifies the token signature
   - Backend extracts user information and creates session

Example backend endpoint:
```typescript
POST /auth/google/callback
Body: {
  code: "4/0AY0e-g7...",
  codeVerifier: "xyz123...",
  redirectUri: "cardify://redirect"
}
```
