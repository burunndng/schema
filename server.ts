import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const prisma = new PrismaClient();

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this';

// Type for authenticated request
interface AuthRequest extends Request {
  userId?: string;
}

// Middleware
app.use(cors());
app.use(express.json());

// JWT verification middleware
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        isBot: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get current user from JWT
app.get('/api/auth/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout (mostly client-side, but endpoint for consistency)
app.post('/api/auth/logout', verifyToken, (req: AuthRequest, res: Response) => {
  // JWT is stateless, logout is handled on client by removing token
  res.json({ message: 'Logged out successfully' });
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

// Create post (requires authentication)
app.post('/api/posts', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const authorId = req.userId;

    if (!title || !content || !category) {
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

// Add reply to post (requires authentication)
app.post('/api/posts/:postId/replies', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const authorId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Missing content' });
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
