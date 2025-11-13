import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { authService } from '../services/authService';
import { aiService } from '../services/aiService';
import { forumDatabaseService } from '../services/forumDatabaseService';
import { Post, User } from '../types/auth';

interface ForumPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'discussions' | 'tests' | 'auraos') => void;
  currentUser: User | null;
  onNeedLogin: () => void;
}

const ForumPageNew: React.FC<ForumPageProps> = ({ onNavigate, currentUser, onNeedLogin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: 'Schema Therapy 101', description: 'Questions and discussions about understanding schemas', emoji: '🧠', color: 'primary' },
    { name: 'Relationship Schemas', description: 'Discussing emotional patterns in relationships', emoji: '💑', color: 'accent' },
    { name: 'Results & Interpretations', description: 'Help understanding your assessment results', emoji: '📊', color: 'primary' },
    { name: 'Success Stories', description: 'Share your breakthroughs and personal growth journeys', emoji: '🌟', color: 'accent' },
    { name: 'Ask the Experts', description: 'Questions for our psychologists and researchers', emoji: '👨‍⚕️', color: 'primary' },
    { name: 'Off-Topic & Fun', description: 'Casual conversations and community building', emoji: '🎉', color: 'accent' },
  ];

  // Load posts from database on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await forumDatabaseService.getAllPosts();
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  // AI Auto-Posting Loop - Disabled for database version
  // TODO: Implement bot posting with database service
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (!aiService.getApiKey()) return;
  //     // ... bot logic here
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [posts]);

  const handleCreatePost = async () => {
    if (!currentUser) {
      onNeedLogin();
      return;
    }

    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      await forumDatabaseService.createPost(newPostTitle, newPostContent, selectedCategory, currentUser);
      setNewPostTitle('');
      setNewPostContent('');
      setShowCreatePost(false);
      await refreshPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleAddReply = async () => {
    if (!currentUser) {
      onNeedLogin();
      return;
    }

    if (!selectedPost || !replyContent.trim()) {
      alert('Please write a reply');
      return;
    }

    try {
      await forumDatabaseService.addReply(selectedPost.id, replyContent, currentUser);
      setReplyContent('');
      // Reload the post to see the new reply
      const updated = await forumDatabaseService.getPostById(selectedPost.id);
      if (updated) {
        setSelectedPost(updated);
      }
      await refreshPosts();
    } catch (err) {
      console.error('Error adding reply:', err);
      alert('Failed to add reply. Please try again.');
    }
  };

  const handleUpvotePost = async () => {
    if (!selectedPost) return;
    try {
      const updated = await forumDatabaseService.upvotePost(selectedPost.id);
      if (updated) {
        setSelectedPost(updated);
        await refreshPosts();
      }
    } catch (err) {
      console.error('Error upvoting post:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost || !currentUser) return;
    if (selectedPost.author.id !== currentUser.id) {
      alert('You can only delete your own posts');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await forumDatabaseService.deletePost(selectedPost.id);
        setSelectedPost(null);
        await refreshPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!selectedPost || !currentUser) return;
    const reply = selectedPost.replies.find(r => r.id === replyId);
    if (reply && reply.author.id !== currentUser.id) {
      alert('You can only delete your own replies');
      return;
    }
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await forumDatabaseService.deleteReply(replyId);
        // Reload the post to see the deleted reply removed
        const updated = await forumDatabaseService.getPostById(selectedPost.id);
        if (updated) {
          setSelectedPost(updated);
        }
        await refreshPosts();
      } catch (err) {
        console.error('Error deleting reply:', err);
        alert('Failed to delete reply');
      }
    }
  };

  if (selectedPost) {
    const currentPostView = posts.find(p => p.id === selectedPost.id) || selectedPost;

    return (
      <div className="space-y-8">
        <div>
          <button
            onClick={() => setSelectedPost(null)}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors mb-4"
          >
            ← Back to {selectedCategory}
          </button>
          <h2 className="text-4xl font-bold mb-2 text-white">{currentPostView.title}</h2>
        </div>

        {/* Original Post */}
        <Card className="border-l-4 border-[var(--primary-500)]">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={currentPostView.author.avatar}
              alt={currentPostView.author.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white">{currentPostView.author.username}</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {new Date(currentPostView.createdAt).toLocaleDateString()}
              </p>
            </div>
            {currentUser?.id === currentPostView.author.id && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>

          <p className="text-white mb-6 leading-relaxed">{currentPostView.content}</p>

          <div className="flex gap-6 text-sm border-t border-gray-700 pt-4">
            <button
              onClick={handleUpvotePost}
              className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
            >
              👍 Upvote ({currentPostView.upvotes})
            </button>
            <span className="text-[var(--text-secondary)]">💬 {currentPostView.replies.length} replies</span>
          </div>
        </Card>

        {/* Add Reply */}
        {currentUser && (
          <Card className="bg-gray-800/50">
            <h4 className="text-lg font-bold text-white mb-4">Add Your Reply</h4>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)] mb-4 h-24"
            />
            <Button
              onClick={handleAddReply}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
            >
              Post Reply
            </Button>
          </Card>
        )}

        {!currentUser && (
          <Card className="bg-blue-500/20 border border-blue-500/50">
            <p className="text-blue-400 text-center">
              <button onClick={onNeedLogin} className="underline hover:no-underline">
                Login
              </button>
              {' '}to reply to this discussion
            </p>
          </Card>
        )}

        {/* Replies */}
        {currentPostView.replies.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">{currentPostView.replies.length} Replies</h4>
            {currentPostView.replies.map(reply => (
              <Card key={reply.id} className="pl-8 border-l-2 border-gray-700">
                <div className="flex items-start gap-4">
                  <img
                    src={reply.author.avatar}
                    alt={reply.author.username}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">{reply.author.username}</p>
                      {currentUser?.id === reply.author.id && (
                        <button
                          onClick={() => handleDeleteReply(reply.id)}
                          className="text-red-500 hover:text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[var(--text-secondary)] mb-3">{reply.content}</p>
                    <button className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)]">
                      👍 Helpful ({reply.upvotes})
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (selectedCategory) {
    const categoryPosts = posts
      .filter(p => p.category === selectedCategory)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return (
      <div className="space-y-8">
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors mb-4"
          >
            ← Back to Categories
          </button>
          <h2 className="text-4xl font-bold mb-2 text-white">{selectedCategory}</h2>
          <p className="text-[var(--text-secondary)]">{categoryPosts.length} discussions</p>
        </div>

        {showCreatePost && currentUser ? (
          <Card className="bg-gray-800/50 border border-[var(--primary-500)]">
            <h3 className="text-xl font-bold text-white mb-4">Start New Discussion</h3>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Discussion title"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)] mb-4"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)] mb-4 h-32"
            />
            <div className="flex gap-4">
              <Button
                onClick={handleCreatePost}
                className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white flex-grow"
              >
                Post Discussion
              </Button>
              <Button
                onClick={() => setShowCreatePost(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            onClick={() => {
              if (!currentUser) {
                onNeedLogin();
              } else {
                setShowCreatePost(true);
              }
            }}
            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
          >
            + Start New Discussion
          </Button>
        )}

        <div className="space-y-4">
          {categoryPosts.map(post => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
              <Card className="hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white truncate flex-grow">{post.title}</h4>
                    {post.pinned && <span className="text-yellow-400 text-sm">📌</span>}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    by <span className="font-semibold">{post.author.username}</span> •{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                    <span>💬 {post.replies.length} replies</span>
                    <span>👍 {post.upvotes} upvotes</span>
                  </div>
                </div>
              </div>
            </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Community Forum</h2>
        <p className="text-xl text-[var(--text-secondary)] mb-6">
          Connect with thousands of others on their schema therapy journey
        </p>
        {currentUser && (
          <p className="text-[var(--primary-500)] mb-4">Welcome, {currentUser.username}!</p>
        )}
      </section>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
          </div>
          <p className="text-[var(--text-secondary)] mt-4">Loading forum discussions...</p>
        </div>
      ) : error ? (
        <Card className="bg-red-500/20 border border-red-500/50">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => refreshPosts()} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </Card>
      ) : (
        <>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-[var(--primary-500)]">
            {authService.getAllUsers().length}
          </div>
          <p className="text-[var(--text-secondary)]">Members</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-[var(--accent-500)]">{posts.length}</div>
          <p className="text-[var(--text-secondary)]">Discussions</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-purple-500">
            {posts.reduce((sum, p) => sum + p.replies.length, 0)}
          </div>
          <p className="text-[var(--text-secondary)]">Replies</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-pink-500">
            {posts.reduce((sum, p) => sum + p.upvotes, 0)}
          </div>
          <p className="text-[var(--text-secondary)]">Upvotes</p>
        </Card>
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Forum Categories</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category.name} onClick={() => setSelectedCategory(category.name)} className="cursor-pointer">
              <Card className="hover:border-[var(--primary-500)] transition-all transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{category.emoji}</div>
                <span className="bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs px-2 py-1 rounded">
                  {posts.filter(p => p.category === category.name).length} posts
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{category.name}</h3>
              <p className="text-[var(--text-secondary)] text-sm">{category.description}</p>
            </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Discussions */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Recent Discussions</h3>
        <div className="space-y-4">
          {posts
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, 5)
            .map(post => (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedCategory(post.category);
                  setSelectedPost(post);
                }}
                className="cursor-pointer"
              >
              <Card className="hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white truncate flex-grow">{post.title}</h4>
                      {post.pinned && <span className="text-yellow-400 text-sm">📌</span>}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      in <span className="font-semibold">{post.category}</span> • by{' '}
                      <span className="font-semibold">{post.author.username}</span>
                    </p>
                    <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                      <span>💬 {post.replies.length} replies</span>
                      <span>👍 {post.upvotes} upvotes</span>
                    </div>
                  </div>
                </div>
              </Card>
              </div>
            ))}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Community Guidelines</h3>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li>✓ Be respectful and kind to all members</li>
          <li>✓ Share experiences, not medical advice</li>
          <li>✓ Keep discussions focused on schemas and mental health</li>
          <li>✓ No spam or harassment</li>
          <li>✓ Have fun and support each other</li>
        </ul>
      </section>
        </>
      )}
    </div>
  );
};

export default ForumPageNew;
