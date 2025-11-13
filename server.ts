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

// Auto-authenticate with demo account for public forum access
const autoAuthDemo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        return next();
      } catch (error) {
        // Token is invalid, continue to create auto-demo
      }
    }

    // Get or create anonymous auto-demo user
    let user = await prisma.user.findFirst({
      where: { email: 'anonymous@demo.local' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'Anonymous',
          email: 'anonymous@demo.local',
          password: await bcrypt.hash('auto_demo_password', 10),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous',
          isBot: false,
        } as any,
      });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Error in autoAuthDemo middleware:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
};

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Database seed endpoint (for initialization)
app.post('/api/seed', async (req: Request, res: Response) => {
  try {
    // Check if users already exist
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return res.status(400).json({ error: 'Database already seeded. Clear users first if you want to reseed.' });
    }

    // Hash passwords
    const demoPassword = await bcrypt.hash('demo123', 10);
    const botPassword = await bcrypt.hash('bot_password', 10);

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        username: 'DemoUser',
        email: 'demo@burundanga.com',
        password: demoPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
        isBot: false,
      } as any,
    });

    // Create AI bot users
    const botConfigs = [
      {
        username: 'Dr. Ada',
        email: 'ada@burundanga.ai',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
      {
        username: 'Curious Casey',
        email: 'casey@burundanga.ai',
        avatar: 'https://i.pravatar.cc/150?img=21',
      },
      {
        username: 'Recovery Ray',
        email: 'ray@burundanga.ai',
        avatar: 'https://i.pravatar.cc/150?img=22',
      },
      {
        username: 'Skeptic Sam',
        email: 'sam@burundanga.ai',
        avatar: 'https://i.pravatar.cc/150?img=23',
      },
    ];

    const bots = [];
    for (const bot of botConfigs) {
      const createdBot = await prisma.user.create({
        data: {
          username: bot.username,
          email: bot.email,
          password: botPassword,
          avatar: bot.avatar,
          isBot: true,
        } as any,
      });
      bots.push(createdBot);
    }

    // Create welcome post
    const welcomePost = await prisma.post.create({
      data: {
        title: 'Welcome to Burundanga Forum!',
        content:
          'This is a demo post. You can now register, create your own posts, and reply to discussions. Start by registering an account! Use the demo account with email "demo@burundanga.com" and password "demo123" to test the forum.',
        category: 'Off-Topic & Fun',
        authorId: demoUser.id,
        pinned: true,
        upvotes: 12,
      },
    });

    // Add demo reply
    if (bots.length > 0) {
      await prisma.reply.create({
        data: {
          content:
            'Great to have you here! This is a test reply from one of our AI assistants. Feel free to ask questions and share your thoughts!',
          postId: welcomePost.id,
          authorId: bots[0].id,
        },
      });
    }

    res.json({
      message: 'Database seeded successfully',
      demoUser: demoUser.email,
      demoPassword: 'demo123',
      botsCreated: bots.length,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
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
      } as any,
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

    // Find user by email (using findUnique without select to get all fields including password)
    const user = await prisma.user.findUnique({
      where: { email },
    }) as any;

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
      create: {
        id,
        username,
        email,
        avatar,
        password: await bcrypt.hash(`synced_${id}`, 10), // Generate a temporary password for synced users
        isBot: false,
      } as any,
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

// Create post (public access with auto-demo account)
app.post('/api/posts', autoAuthDemo, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const authorId = req.userId!; // autoAuthDemo guarantees userId

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId,
      } as any,
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

// Add reply to post (public access with auto-demo account)
app.post('/api/posts/:postId/replies', autoAuthDemo, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const authorId = req.userId!; // autoAuthDemo guarantees userId

    if (!content) {
      return res.status(400).json({ error: 'Missing content' });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        postId,
        authorId,
      } as any,
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
