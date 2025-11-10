import { User, AuthUser, Post, Reply } from '../types/auth';

const USERS_KEY = 'burundanga_users';
const CURRENT_USER_KEY = 'burundanga_current_user';
const POSTS_KEY = 'burundanga_posts';

// User Management
export const authService = {
  // Register a new user
  register: (username: string, email: string, password: string): User | null => {
    const users = getAllUsers();

    // Check if user already exists
    if (users.some(u => u.username === username || u.email === email)) {
      return null;
    }

    const userId = `user_${Date.now()}`;
    const newUser: AuthUser = {
      id: userId,
      username,
      email,
      password, // In real app, this would be hashed
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  login: (email: string, password: string): User | null => {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && (u as AuthUser).password === password);

    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current logged-in user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
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
