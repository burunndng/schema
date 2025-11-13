<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Burundanga - Schema Therapy Assessments with Forum

This contains everything you need to run your app locally, including a fully functional forum backend API.

View your app in AI Studio: https://ai.studio/apps/drive/141M644FmoH0caBqbhKr9X6wvX7WA_BkN

## Quick Start

**Prerequisites:** Node.js

### Option 1: Start Everything with One Command

```bash
# Install dependencies
npm install

# Start both backend and frontend
npm run start:full
```

This will:
- Set up the SQLite database
- Start the backend API server on http://localhost:3001
- Start the frontend on http://localhost:5173

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend API:**
   ```bash
   ./start-backend.sh
   # or
   npm run dev:server
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Forum Backend API

The forum includes a complete backend API with SQLite database:

- **API Server:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **Posts API:** http://localhost:3001/api/posts
- **Database:** Local SQLite (`dev.db`)

### API Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a post
- `GET /api/posts/:id` - Get single post with replies
- `POST /api/posts/:id/replies` - Add reply to post

### Setup Documentation
- [Backend Setup Guide](./BACKEND_SETUP_GUIDE.md) - Detailed backend setup instructions
- [Forum Database Setup](./FORUM_DATABASE_SETUP.md) - Database configuration

## Environment Configuration

The app uses `.env.local` for configuration. Key variables:

```bash
# Database (SQLite for local development)
DATABASE_URL="file:./dev.db"

# API Server URL
VITE_API_URL=http://localhost:3001

# Gemini API (optional)
GEMINI_API_KEY=your_api_key_here
```

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend only |
| `npm run dev:server` | Start backend API only |
| `npm run start:full` | Start both frontend and backend |
| `npm run start:server` | Setup database and start backend |
| `./start-backend.sh` | Easy backend setup script |
| `npm run db:studio` | Browse database with Prisma Studio |

## Testing the Forum

1. Start both servers (`npm run start:full`)
2. Open http://localhost:5173
3. Navigate to the Forum section
4. Create a post and verify it appears in the forum

## Troubleshooting

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:3001/health

# Restart backend
./start-backend.sh
```

### Database Issues
```bash
# Recreate database
rm dev.db
npm run db:push
```

For detailed troubleshooting, see [Backend Setup Guide](./BACKEND_SETUP_GUIDE.md).
