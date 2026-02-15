# Heroku Environment Variables Setup Guide

## Required Environment Variables

### 1. MONGODB_URI
Your MongoDB Atlas connection string (required for production).

**How to get it:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `vehicle_management`)

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vehicle_management?retryWrites=true&w=majority
```

**Set on Heroku:**
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vehicle_management?retryWrites=true&w=majority"
```

---

### 2. NEXTAUTH_SECRET
A random secret key used to encrypt JWT tokens and session data.

**How to generate:**

**Option 1 - Using OpenSSL (Recommended):**
```bash
openssl rand -base64 32
```

**Option 2 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 - Online Generator:**
Visit: https://generate-secret.vercel.app/32

**Set on Heroku:**
```bash
heroku config:set NEXTAUTH_SECRET="your_generated_secret_here"
```

**Example:**
```bash
heroku config:set NEXTAUTH_SECRET="Xk7pQ9mN2vB8wR5tY3hJ6gF4dS1aZ0cV8xL9nM2bQ4="
```

---

### 3. NEXTAUTH_URL
The full URL of your deployed application.

**Format:**
```
https://your-app-name.herokuapp.com
```

**Set on Heroku:**
```bash
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"
```

**Important:** Replace `your-app-name` with your actual Heroku app name.

---

### 4. NODE_ENV (Optional but Recommended)
Tells Next.js to run in production mode.

**Set on Heroku:**
```bash
heroku config:set NODE_ENV="production"
```

---

## Complete Setup Commands

Run all these commands in order:

```bash
# 1. Generate and set NEXTAUTH_SECRET
heroku config:set NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# 2. Set MongoDB URI (replace with your actual connection string)
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vehicle_management?retryWrites=true&w=majority"

# 3. Set NEXTAUTH_URL (replace your-app-name with your Heroku app name)
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"

# 4. Set NODE_ENV
heroku config:set NODE_ENV="production"
```

---

## Verify Environment Variables

Check all configured variables:
```bash
heroku config
```

Check a specific variable:
```bash
heroku config:get NEXTAUTH_SECRET
```

---

## Update Environment Variables

To update any variable, just run the config:set command again:
```bash
heroku config:set NEXTAUTH_SECRET="new_secret_value"
```

---

## Remove Environment Variables

```bash
heroku config:unset VARIABLE_NAME
```

---

## MongoDB Atlas Setup Steps

1. **Create Account**: Sign up at https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Choose free tier (M0)
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Save username and password
4. **Whitelist IPs**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Heroku
5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` and `<dbname>`

---

## Testing Locally with Production Variables

Create a `.env.production.local` file (don't commit this):
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vehicle_management
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

Test with:
```bash
npm run build
npm start
```

---

## Troubleshooting

### NextAuth Session Issues
- Ensure NEXTAUTH_SECRET is set and at least 32 characters
- Verify NEXTAUTH_URL matches your Heroku app URL exactly
- Check that URL includes `https://` (not `http://`)

### Database Connection Errors
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username and password in connection string
- Ensure database name is correct
- Test connection string locally first

### Environment Variables Not Working
- Run `heroku config` to verify they're set
- Restart app: `heroku restart`
- Check logs: `heroku logs --tail`
