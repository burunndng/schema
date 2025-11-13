#!/bin/bash

# Forum Backend Startup Script
# This script sets up and starts the forum backend API

echo "🚀 Starting Forum Backend Setup..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
if [ ! -f "dev.db" ]; then
    echo "🗄️  Setting up database..."
    DATABASE_URL="file:./dev.db" npm run db:push
fi

# Kill any existing server on port 3001
echo "🔄 Checking for existing server..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start the server
echo "🌐 Starting backend server on http://localhost:3001"
DATABASE_URL="file:./dev.db" nohup node test-server.cjs > server.log 2>&1 &

# Wait for server to start
sleep 3

# Test if server is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend server is running successfully!"
    echo "📊 API Health: http://localhost:3001/health"
    echo "📝 Posts API: http://localhost:3001/api/posts"
    echo "📋 Server logs: tail -f server.log"
    echo ""
    echo "To start the frontend, run: npm run dev"
    echo "To stop the server, run: pkill -f 'node test-server.cjs'"
else
    echo "❌ Failed to start server. Check server.log for details."
    tail -20 server.log
fi