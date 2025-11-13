const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const category = req.query.category;

    const posts = await prisma.post.findMany({
      where: category ? { category } : undefined,
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post (simplified for demo)
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For demo purposes, create a simple user if none exists
    let author = await prisma.user.findFirst();
    if (!author) {
      author = await prisma.user.create({
        data: {
          username: 'DemoUser',
          email: 'demo@burundanga.com',
          password: await bcrypt.hash('demo123', 10),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
          isBot: false,
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId: author.id,
      },
      include: {
        author: true,
        replies: {
          include: { author: true },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Forum API server running on port ${PORT}`);
});