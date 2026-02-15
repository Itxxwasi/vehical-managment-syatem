# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed ([Download here](https://devcenter.heroku.com/articles/heroku-cli))
- Git initialized in your project
- Heroku account

## Step 1: Login to Heroku
```bash
heroku login
```

## Step 2: Create Heroku App
```bash
heroku create your-app-name
```

## Step 3: Set Environment Variables
Set all required environment variables on Heroku:

```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set NEXTAUTH_SECRET="your_production_secret"
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"
heroku config:set NODE_ENV="production"
```

### Important Notes:
- Replace `your_mongodb_atlas_uri` with your MongoDB Atlas connection string (Heroku doesn't support local MongoDB)
- Generate a secure NEXTAUTH_SECRET: `openssl rand -base64 32`
- Replace `your-app-name` with your actual Heroku app name

## Step 4: Configure MongoDB Atlas
Since Heroku doesn't support local MongoDB, you need to use MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Heroku
5. Get your connection string and set it as MONGODB_URI

## Step 5: Deploy to Heroku
```bash
git add .
git commit -m "Configure for Heroku deployment"
git push heroku main
```

If your branch is named `master`:
```bash
git push heroku master
```

## Step 6: Open Your App
```bash
heroku open
```

## Useful Commands

### View logs
```bash
heroku logs --tail
```

### Restart app
```bash
heroku restart
```

### Check config variables
```bash
heroku config
```

### Run seed script (if needed)
```bash
heroku run npm run seed
```

## Troubleshooting

### Build fails
- Check logs: `heroku logs --tail`
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Verify Node.js version compatibility

### App crashes on startup
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs for specific errors

### Database connection issues
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify connection string format
- Check database user permissions
