import { User, AuthUser, Post, Reply } from '../types/auth';

const USERS_KEY = 'burundanga_users';
const CURRENT_USER_KEY = 'burundanga_current_user';
const POSTS_KEY = 'burundanga_posts';
const TOKEN_KEY = 'burundanga_token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Token Management
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

const getAuthHeaders = (token?: string): HeadersInit => {
  const authToken = token || getToken();
  return {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  };
};

// User Management
export const authService = {
  // Register a new user via API
  register: async (username: string, email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        console.error('Registration failed:', await response.text());
        return null;
      }

      const data = await response.json();
      setToken(data.token);

      // Store user in localStorage for quick access
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  },

  // Login user via API
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      console.log(`[Auth] Logging in user: ${email}`);
      console.log(`[Auth] API URL: ${API_URL}`);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      console.log(`[Auth] Login response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Auth] Login failed with status ${response.status}:`, errorText);
        return null;
      }

      const data = await response.json();
      console.log(`[Auth] Login successful for user:`, data.user);
      setToken(data.token);

      // Store user in localStorage for quick access
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('[Auth] Error logging in user:', error);
      console.error('[Auth] Make sure the Express server is running with: npm run dev:server');
      return null;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(token),
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      removeToken();
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Get current logged-in user from API
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = getToken();
      console.log(`[Auth] Getting current user, token exists: ${!!token}`);

      if (!token) {
        // Try to get from localStorage as fallback
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        console.log(`[Auth] No token, checking localStorage fallback`);
        return userStr ? JSON.parse(userStr) : null;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      console.log(`[Auth] /api/auth/me response status: ${response.status}`);

      if (!response.ok) {
        console.log(`[Auth] Current user API failed, clearing tokens`);
        removeToken();
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      const user = await response.json();
      console.log(`[Auth] Got current user from API:`, user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('[Auth] Error fetching current user:', error);
      // Fallback to localStorage
      console.log(`[Auth] Falling back to localStorage`);
      const userStr = localStorage.getItem(CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
  },

  // Get all users
  getAllUsers: getAllUsers,

  // Get user by ID
  getUserById: (userId: string): User | null => {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update user profile
  updateProfile: (userId: string, updates: Partial<User>): User | null => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return null;

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = updatedUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },
};

// Post Management
export const postService = {
  // Create a new post
  createPost: (title: string, content: string, category: string, author: User): Post => {
    const posts = getAllPosts();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      title,
      content,
      author,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      upvotes: 0,
    };

    posts.push(newPost);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return newPost;
  },

  // Get all posts
  getAllPosts: getAllPosts,

  // Get posts by category
  getPostsByCategory: (category: string): Post[] => {
    const posts = getAllPosts();
    return posts.filter(p => p.category === category).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get post by ID
  getPostById: (postId: string): Post | null => {
    const posts = getAllPosts();
    return posts.find(p => p.id === postId) || null;
  },

  // Get posts by author
  getPostsByAuthor: (authorId: string): Post[] => {
    const posts = getAllPosts();
    return posts.filter(p => p.author.id === authorId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Update post
  updatePost: (postId: string, updates: Partial<Post>): Post | null => {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return null;

    const updatedPost = { ...posts[postIndex], ...updates, updatedAt: new Date().toISOString() };
    posts[postIndex] = updatedPost;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return updatedPost;
  },

  // Delete post
  deletePost: (postId: string): boolean => {
    const posts = getAllPosts();
    const filtered = posts.filter(p => p.id !== postId);
    if (filtered.length === posts.length) return false;
    localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Add reply to post
  addReply: (postId: string, content: string, author: User): Post | null => {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      content,
      author,
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };

    post.replies.push(newReply);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  },

  // Delete reply
  deleteReply: (postId: string, replyId: string): Post | null => {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    post.replies = post.replies.filter(r => r.id !== replyId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  },

  // Upvote post
  upvotePost: (postId: string): Post | null => {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    post.upvotes += 1;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  },

  // Pin post (admin only)
  pinPost: (postId: string): Post | null => {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    post.pinned = !post.pinned;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  },
};

// Helper functions
function getAllUsers(): AuthUser[] {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : getDefaultUsers();
}

function getAllPosts(): Post[] {
  const postsStr = localStorage.getItem(POSTS_KEY);
  return postsStr ? JSON.parse(postsStr) : getDefaultPosts();
}

// Initialize with some default users and posts
function getDefaultUsers(): AuthUser[] {
  return [
    {
      id: 'user_demo',
      username: 'DemoUser',
      email: 'demo@burundanga.com',
      password: 'demo123',
      avatar: 'https://i.pravatar.cc/150?img=3',
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // AI Bot Accounts
    {
      id: 'bot_ada',
      username: 'Dr. Ada',
      email: 'ada@burundanga.ai',
      password: 'bot_password',
      avatar: 'https://i.pravatar.cc/150?img=20',
      joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      isBot: true,
      bio: 'Schema Therapy Expert | AI Therapist',
    },
    {
      id: 'bot_casey',
      username: 'Curious Casey',
      email: 'casey@burundanga.ai',
      password: 'bot_password',
      avatar: 'https://i.pravatar.cc/150?img=21',
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      isBot: true,
      bio: 'Forever Learning 📚',
    },
    {
      id: 'bot_ray',
      username: 'Recovery Ray',
      email: 'ray@burundanga.ai',
      password: 'bot_password',
      avatar: 'https://i.pravatar.cc/150?img=22',
      joinDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      isBot: true,
      bio: 'Breakthrough Stories & Motivation 🌟',
    },
    {
      id: 'bot_sam',
      username: 'Skeptic Sam',
      email: 'sam@burundanga.ai',
      password: 'bot_password',
      avatar: 'https://i.pravatar.cc/150?img=23',
      joinDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      isBot: true,
      bio: 'Critical Thinker | Devil\'s Advocate',
    },
  ];
}

function getDefaultPosts(): Post[] {
  const demoUser: User = {
    id: 'user_demo',
    username: 'DemoUser',
    email: 'demo@burundanga.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return [
    {
      id: 'post_1',
      title: 'Welcome to Burundanga Forum!',
      content: 'This is a demo post. You can now register, create your own posts, and reply to discussions. Start by registering an account!',
      author: demoUser,
      category: 'Off-Topic & Fun',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      replies: [],
      upvotes: 12,
      pinned: true,
    },
  ];
}
