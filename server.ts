import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ==================== USER ROUTES ====================

// Get or create user (for forum authentication)
app.post('/api/users/sync', async (req: Request, res: Response) => {
  try {
    const { id, username, email, avatar } = req.body;

    if (!id || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: { username, email, avatar },
      create: { id, username, email, avatar, isBot: false },
    });

    res.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// ==================== POST ROUTES ====================

// Get all posts
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

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

// Get single post with replies
app.get('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const { title, content, category, authorId } = req.body;

    if (!title || !content || !category || !authorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId,
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

// Update post (pin/unpin)
app.patch('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pinned, upvotes } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(pinned !== undefined && { pinned }),
        ...(upvotes !== undefined && { upvotes }),
      },
      include: {
        author: true,
        replies: {
          include: { author: true },
        },
      },
    });

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Upvote post
app.post('/api/posts/:id/upvote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { upvotes: post.upvotes + 1 },
      include: {
        author: true,
        replies: {
          include: { author: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error upvoting post:', error);
    res.status(500).json({ error: 'Failed to upvote post' });
  }
});

// ==================== REPLY ROUTES ====================

// Add reply to post
app.post('/api/posts/:postId/replies', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, authorId } = req.body;

    if (!content || !authorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: true,
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

// Delete reply
app.delete('/api/replies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.reply.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ error: 'Failed to delete reply' });
  }
});

// Upvote reply
app.post('/api/replies/:id/upvote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id },
    });

    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const updated = await prisma.reply.update({
      where: { id },
      data: { upvotes: reply.upvotes + 1 },
      include: {
        author: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error upvoting reply:', error);
    res.status(500).json({ error: 'Failed to upvote reply' });
  }
});

// Error handling
app.use((err: any, req: Request, res: Response) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Forum API server running on port ${PORT}`);
});
