# Database Setup Instructions

Your database credentials are configured in `.env.local`. Due to network restrictions in this environment, you'll need to complete the table creation step manually. Here are your options:

## Option 1: Setup from Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your Postgres Database**
3. **Open the SQL Editor tab**
4. **Run the following SQL to create the tables**:

```sql
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  "isBot" BOOLEAN NOT NULL DEFAULT false,
  "joinDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Post table
CREATE TABLE IF NOT EXISTS "Post" (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("authorId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create Reply table
CREATE TABLE IF NOT EXISTS "Reply" (
  id TEXT NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  "postId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "Post" (id) ON DELETE CASCADE,
  FOREIGN KEY ("authorId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_author ON "Post" ("authorId");
CREATE INDEX IF NOT EXISTS idx_post_category ON "Post" (category);
CREATE INDEX IF NOT EXISTS idx_reply_post ON "Reply" ("postId");
CREATE INDEX IF NOT EXISTS idx_reply_author ON "Reply" ("authorId");
```

5. **Click "Run Query"** and wait for it to complete

That's it! Your tables are now created.

## Option 2: Setup Locally (When You Deploy)

If you deploy to Vercel, you can run the database setup as part of your deployment:

1. Add to `vercel.json`:
```json
{
  "buildCommand": "npm run build && npm run db:setup",
  "outputDirectory": "dist"
}
```

2. Vercel will automatically create the tables during deployment

## Option 3: Use Database GUI Tool

You can also use a PostgreSQL GUI like:
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

Connect using:
- **Host**: `db.prisma.io`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `a9da339cdbbbdbd06464c81dfde7f24cd111a4694b4ecc574e2ec62a8c03ccdc`
- **Password**: `sk_9qp9IFu_caR1UWec_cVUd`

Then run the SQL from Option 1.

## After Tables are Created

Once your tables are set up, you can:

### 1. Start the API Server
```bash
npm run dev:server
```
This starts the Express API on `http://localhost:3001`

### 2. Start the Frontend
```bash
npm run dev
```
This starts the React app on `http://localhost:5173`

### 3. Test the Forum
- Navigate to **Forum** in the navigation menu
- Try creating a post
- The data should now persist in your Vercel Postgres database!

## Verify the Setup

To verify everything is working, you can check:
- Look at the database in Vercel dashboard → Data → SQL Editor
- Run: `SELECT * FROM "User";`
- Run: `SELECT * FROM "Post";`

## Environment Variables Summary

Your `.env.local` file contains:
```
DATABASE_URL=postgres://user:password@db.prisma.io:5432/postgres?sslmode=require
REACT_APP_API_URL=http://localhost:3001
GEMINI_API_KEY=your_key_here
```

## Next Steps

1. ✅ Install dependencies - Done
2. ✅ Create `.env.local` - Done
3. ⬜ **Create database tables** - Complete this using Option 1, 2, or 3 above
4. ⬜ Run `npm run dev:server` to start the API
5. ⬜ Run `npm run dev` to start the frontend
6. ⬜ Test the forum with real database persistence!

## Troubleshooting

### API returns "Failed to load posts"
- Check that the API server is running: `npm run dev:server`
- Check `REACT_APP_API_URL` in `.env.local`
- Check database tables exist in Vercel dashboard

### "Connection refused" errors
- Ensure `DATABASE_URL` is correct in `.env.local`
- Check that the database tables were created
- Verify SSL connection: URL should have `?sslmode=require`

### Still having issues?
- Check logs in browser console (F12)
- Check terminal output from `npm run dev:server`
- Verify tables exist by running `\dt` in Vercel SQL Editor
