/**
 * Forum Database Service
 * Handles all communication with the backend database API
 * Replaces localStorage-based postService for persistent storage
 */

import { Post, User } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface DatabasePost extends Post {
  id: string;
}

export interface DatabaseReply {
  id: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: string;
  upvotes: number;
}

class ForumDatabaseService {
  private apiUrl = API_URL;

  /**
   * Initialize API URL (useful for environment-specific URLs)
   */
  setApiUrl(url: string) {
    this.apiUrl = url;
  }

  /**
   * Sync user to database (create or update)
   */
  async syncUser(user: User): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to sync user');
      return await response.json();
    } catch (error) {
      console.error('Error syncing user:', error);
      return null;
    }
  }

  /**
   * Get all posts, optionally filtered by category
   */
  async getAllPosts(category?: string): Promise<DatabasePost[]> {
    try {
      const url = new URL(`${this.apiUrl}/api/posts`);
      if (category) url.searchParams.append('category', category);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch posts');

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Get single post by ID with all replies
   */
  async getPostById(postId: string): Promise<DatabasePost | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');

      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(category: string): Promise<DatabasePost[]> {
    return this.getAllPosts(category);
  }

  /**
   * Create a new post
   */
  async createPost(
    title: string,
    content: string,
    category: string,
    author: User
  ): Promise<DatabasePost | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          authorId: author.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  /**
   * Upvote a post
   */
  async upvotePost(postId: string): Promise<DatabasePost | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to upvote post');
      return await response.json();
    } catch (error) {
      console.error('Error upvoting post:', error);
      return null;
    }
  }

  /**
   * Add a reply to a post
   */
  async addReply(
    postId: string,
    content: string,
    author: User
  ): Promise<DatabaseReply | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorId: author.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to add reply');
      return await response.json();
    } catch (error) {
      console.error('Error adding reply:', error);
      return null;
    }
  }

  /**
   * Delete a reply
   */
  async deleteReply(replyId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/replies/${replyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete reply');
      return true;
    } catch (error) {
      console.error('Error deleting reply:', error);
      return false;
    }
  }

  /**
   * Upvote a reply
   */
  async upvoteReply(replyId: string): Promise<DatabaseReply | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/replies/${replyId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to upvote reply');
      return await response.json();
    } catch (error) {
      console.error('Error upvoting reply:', error);
      return null;
    }
  }
}

export const forumDatabaseService = new ForumDatabaseService();
