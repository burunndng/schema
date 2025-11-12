import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sql = `
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  "isBot" BOOLEAN NOT NULL DEFAULT false,
  "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create Reply table
CREATE TABLE IF NOT EXISTS "Reply" (
  id TEXT NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  "postId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Reply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" (id) ON DELETE CASCADE,
  CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post" ("authorId");
CREATE INDEX IF NOT EXISTS "Post_category_idx" ON "Post" (category);
CREATE INDEX IF NOT EXISTS "Reply_postId_idx" ON "Reply" ("postId");
CREATE INDEX IF NOT EXISTS "Reply_authorId_idx" ON "Reply" ("authorId");
`;

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('🔄 Creating tables...');
    await client.query(sql);
    console.log('✅ Tables created successfully!');

    console.log('🔄 Verifying tables...');
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tables in database:');
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n✨ Database setup complete!');
    console.log('\nYou can now:');
    console.log('1. Run "npm run dev:server" to start the API server');
    console.log('2. Run "npm run dev" to start the frontend');
    console.log('3. Visit http://localhost:5173 to use the forum\n');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
