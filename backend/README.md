# Training SPA Backend

Backend API for Training SPA with JWT-based authentication.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/training_spa?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: User object + JWT cookie

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User object + JWT cookie

#### Logout
- **POST** `/api/auth/logout`
- **Response**: Success message

#### Verify Token
- **GET** `/api/auth/verify`
- **Headers**: Cookie with JWT token
- **Response**: User object

### Health Check
- **GET** `/api/health`
- **Response**: `{ status: 'ok' }`

## Database Management

View database in Prisma Studio:
```bash
npm run prisma:studio
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens stored in httpOnly cookies
- CORS configured for frontend origin
- Input validation on all endpoints
- SQL injection protection via Prisma ORM
