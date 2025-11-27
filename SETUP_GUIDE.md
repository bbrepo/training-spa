# Authentication System Setup Guide

This guide will help you set up and run the complete authentication system with backend and frontend.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database installed and running
- npm or yarn

## Step 1: Configure Backend Environment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Edit the `.env` file and update your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/training_spa?schema=public"
JWT_SECRET="training-spa-super-secret-jwt-key-2024-change-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Important**: Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual PostgreSQL credentials.

## Step 2: Set Up Database

Run the Prisma migration to create the database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `training_spa` database (if it doesn't exist)
- Create the `users` table with the schema defined in `prisma/schema.prisma`

## Step 3: Start the Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

## Step 4: Start the Frontend

Open a **new terminal** and navigate to the project root:

```bash
cd /Users/admin/Desktop/Projects/training-spa
npm start
```

The React app will start on `http://localhost:3000`

## Testing the Authentication System

### 1. Register a New User
- Click the "Register Now" button in the navbar
- Switch to the "Register" tab in the modal
- Fill in:
  - Full Name
  - Email Address
  - Password (minimum 5 characters)
- Click "Register"

### 2. Login
- Click "Register Now" (or "Login" if you see it)
- Use the "Login" tab
- Enter your email and password
- Click "Login"

### 3. Verify Session
- After login, you should see "Hi, [Your Name]" in the navbar
- Refresh the page - you should stay logged in (session persistence)

### 4. Logout
- Click the "Logout" button in the navbar
- You should be logged out and see "Register Now" again

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Check your DATABASE_URL in `.env`
- Ensure the database user has proper permissions

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): The React app will prompt you to use a different port

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your React app URL
- Default is `http://localhost:3000`

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify current session
- `GET /api/health` - Health check

## Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ JWT tokens in httpOnly cookies (XSS protection)
✅ CORS configured for frontend origin only
✅ Input validation on all endpoints
✅ SQL injection protection via Prisma ORM
✅ Session persistence across page refreshes

## Database Management

View and manage your database using Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit users.

## Next Steps

- Customize the modal styling in `src/Components/AuthModal.css`
- Add email verification (optional)
- Implement password reset functionality
- Add user profile management
- Create protected routes that require authentication
