# Forum Database Setup Guide

This guide explains how to set up the Forum with a persistent database using Vercel Postgres.

## Quick Start

### 1. Create a Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** → **Create** → **Postgres**
4. Name it "burundanga-forum"
5. Copy the `DATABASE_URL` from the connection details

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# API Server (when developing locally)
REACT_APP_API_URL=http://localhost:3001

# Gemini API
GEMINI_API_KEY=your_key_here
```

### 3. Push Schema to Database

```bash
npm run db:push
```

This creates the required tables (users, posts, replies) in your database.

### 4. Start the Backend Server

In one terminal:

```bash
npm run dev:server
```

This starts the API server on `http://localhost:3001`

### 5. Start the Frontend

In another terminal:

```bash
npm run dev
```

Now the forum will use the database instead of localStorage!

## Database Management

### View Database Contents

```bash
npm run db:studio
```

Opens Prisma Studio to browse and edit database data.

### Create Migrations

When you modify `prisma/schema.prisma`:

```bash
npm run db:migrate
```

## How It Works

### Data Flow

1. **Frontend** (ForumPageNew.tsx) → Uses `forumDatabaseService`
2. **API Server** (server.ts) → Express.js server with REST endpoints
3. **Database** (Vercel Postgres) → Persistent storage

### API Endpoints

#### Posts
- `GET /api/posts` - List all posts
- `GET /api/posts?category=SchemaTherapy101` - Filter by category
- `GET /api/posts/:id` - Get single post with replies
- `POST /api/posts` - Create post
- `PATCH /api/posts/:id` - Update post (pin/unpin, upvotes)
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/upvote` - Upvote post

#### Replies
- `POST /api/posts/:postId/replies` - Add reply
- `DELETE /api/replies/:id` - Delete reply
- `POST /api/replies/:id/upvote` - Upvote reply

#### Users
- `POST /api/users/sync` - Sync user to database

## Deployment to Vercel

### 1. Create API Routes (Optional)

If you want to deploy the API to Vercel as serverless functions, create:

```
api/
  posts.ts
  users.ts
  replies.ts
```

### 2. Update Environment Variables

In Vercel dashboard, add:
- `DATABASE_URL` - Your Vercel Postgres connection string
- `REACT_APP_API_URL` - Your deployed API URL

### 3. Deploy

```bash
git push origin your-branch
```

Vercel automatically deploys both frontend and API.

## Troubleshooting

### Database Connection Error

**Problem**: `Error: P1000: Authentication failed`

**Solution**: Check your `DATABASE_URL` is correct and the database is running.

### API Not Responding

**Problem**: `fetch failed: connection refused`

**Solution**: Make sure the API server is running (`npm run dev:server`)

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::3001`

**Solution**: Kill the process using port 3001 or change PORT in .env.local

## Migration from localStorage

The forum automatically uses the database service. Old localStorage data won't be migrated, so start fresh with the database!

If you want to preserve old posts, you can manually insert them:

```bash
npm run db:studio
```

Then create posts through the UI.

## Next Steps

- [ ] Connect to Vercel Postgres
- [ ] Run `npm run db:push` to create tables
- [ ] Start `npm run dev:server`
- [ ] Start `npm run dev` and test the forum
- [ ] Deploy to Vercel
