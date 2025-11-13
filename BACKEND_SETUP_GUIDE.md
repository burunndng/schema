# Forum Backend API Setup Guide

This guide explains how to set up and run the forum backend API that powers the Burundanga forum.

## Quick Start

### 1. Environment Setup

The project uses a local SQLite database for development. The environment is already configured in `.env.local`:

```bash
# Database Connection (using local SQLite for development)
DATABASE_URL="file:./dev.db"

# API Server URL (used by frontend)
VITE_API_URL=http://localhost:3001

# JWT Secret for authentication
JWT_SECRET=dev_jwt_secret_key_change_in_production
```

### 2. Database Setup

Initialize the database with the required tables:

```bash
npm run db:push
```

This command:
- Creates a SQLite database file (`dev.db`) in the project root
- Sets up the required tables (users, posts, replies) based on the Prisma schema
- Generates the Prisma client

### 3. Start the Backend Server

```bash
npm run dev:server
```

The server will start on `http://localhost:3001` and display:
```
Forum API server running on port 3001
```

### 4. Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` and connect to the backend API.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:server` | Start the backend API server |
| `npm run start:server` | Initialize database and start server |
| `npm run start:full` | Start both backend and frontend concurrently |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Prisma Studio to browse database |
| `npm run db:seed` | Seed database with demo data |

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts?category=CategoryName` - Get posts by category
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a single post with replies
- `PATCH /api/posts/:id` - Update post (pin/unpin, upvotes)
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/upvote` - Upvote a post

### Users
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/users/sync` - Sync user to database

### Replies
- `POST /api/posts/:postId/replies` - Add reply to post
- `DELETE /api/replies/:id` - Delete reply
- `POST /api/replies/:id/upvote` - Upvote reply

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `avatar` - Avatar URL
- `isBot` - Boolean for bot users
- `joinDate`, `createdAt`, `updatedAt` - Timestamps

### Posts Table
- `id` - Primary key
- `title` - Post title
- `content` - Post content
- `category` - Post category
- `pinned` - Boolean for pinned posts
- `upvotes` - Upvote count
- `authorId` - Foreign key to users
- `createdAt`, `updatedAt` - Timestamps

### Replies Table
- `id` - Primary key
- `content` - Reply content
- `upvotes` - Upvote count
- `postId` - Foreign key to posts
- `authorId` - Foreign key to users
- `createdAt`, `updatedAt` - Timestamps

## Testing the API

### Test Health Check
```bash
curl http://localhost:3001/health
# Response: {"status":"ok"}
```

### Test Creating a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"This is a test post","category":"Test"}'
```

### Test Getting All Posts
```bash
curl http://localhost:3001/api/posts
```

## Development Workflow

1. **Make schema changes**: Edit `prisma/schema.prisma`
2. **Apply changes**: `npm run db:push`
3. **Restart server**: Stop and restart `npm run dev:server`
4. **Test endpoints**: Use curl or the frontend

## Production Considerations

For production deployment:

1. **Database**: Replace SQLite with PostgreSQL or MySQL
2. **Environment**: Set strong JWT_SECRET and proper DATABASE_URL
3. **Authentication**: Implement proper JWT validation
4. **CORS**: Configure appropriate CORS settings
5. **Rate Limiting**: Add rate limiting to prevent abuse

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues
```bash
# Recreate database
rm dev.db
npm run db:push
```

### Server Won't Start
```bash
# Check dependencies
npm install

# Check environment variables
cat .env.local
```

### Frontend Connection Errors
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `.env.local`
- Verify no firewall blocking localhost connections

## File Structure

```
project/
├── .env.local              # Environment variables
├── dev.db                  # SQLite database file
├── test-server.cjs         # Backend server (CommonJS)
├── server.ts               # Full backend server (TypeScript)
├── package.json            # Dependencies and scripts
├── prisma/
│   └── schema.prisma       # Database schema
└── node_modules/           # Dependencies
```

## Migration from TypeScript Server

The project includes both:
- `server.ts` - Full-featured TypeScript server with authentication
- `test-server.cjs` - Simplified CommonJS server for development

Use `test-server.cjs` for local development as it handles ES module compatibility better. The TypeScript version can be used for production or when full authentication features are needed.