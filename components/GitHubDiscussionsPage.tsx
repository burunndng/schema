import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { githubDiscussionsService, GitHubDiscussion, GitHubDiscussionCategory } from '../services/githubDiscussionsService';
import { User } from '../types/auth';

interface GitHubDiscussionsPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'tests' | 'auraos' | 'discussions') => void;
  currentUser: User | null;
}

const GitHubDiscussionsPage: React.FC<GitHubDiscussionsPageProps> = ({ onNavigate, currentUser }) => {
  const [discussions, setDiscussions] = useState<GitHubDiscussion[]>([]);
  const [categories, setCategories] = useState<GitHubDiscussionCategory[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<GitHubDiscussion | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Load GitHub token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
      githubDiscussionsService.setToken(savedToken);
    }
  }, []);

  // Fetch discussions and categories on component mount or token change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [fetchedDiscussions, fetchedCategories] = await Promise.all([
          githubDiscussionsService.getDiscussions(),
          githubDiscussionsService.getCategories(),
        ]);

        setDiscussions(fetchedDiscussions);
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Failed to load discussions. Please try again later.');
        console.error('Error loading discussions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [githubToken]);

  const handleSaveToken = () => {
    if (githubToken.trim()) {
      localStorage.setItem('github_token', githubToken);
      githubDiscussionsService.setToken(githubToken);
      setShowTokenInput(false);
      githubDiscussionsService.clearCache();
      // Refresh discussions with new token
      window.location.reload();
    }
  };

  const filteredDiscussions = selectedCategory
    ? discussions.filter(d => d.category?.slug === selectedCategory)
    : discussions;

  if (selectedDiscussion) {
    return (
      <div className="space-y-8">
        <div>
          <button
            onClick={() => setSelectedDiscussion(null)}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors mb-4"
          >
            ← Back to Discussions
          </button>
          <h2 className="text-4xl font-bold mb-2 text-white">{selectedDiscussion.title}</h2>
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <img
              src={selectedDiscussion.author.avatarUrl}
              alt={selectedDiscussion.author.login}
              className="w-10 h-10 rounded-full"
            />
            <span>by <strong>{selectedDiscussion.author.login}</strong></span>
            <span>•</span>
            <span>{new Date(selectedDiscussion.createdAt).toLocaleDateString()}</span>
            {selectedDiscussion.isAnswered && (
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">✓ Answered</span>
            )}
          </div>
        </div>

        <Card className="border-l-4 border-[var(--primary-500)]">
          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-white whitespace-pre-wrap">{selectedDiscussion.body}</p>
          </div>

          <div className="flex gap-6 text-sm border-t border-gray-700 pt-4">
            <span className="text-[var(--primary-500)]">💬 {selectedDiscussion.comments} comments</span>
            <a
              href={selectedDiscussion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </Card>

        <Card className="bg-blue-500/20 border border-blue-500/50">
          <p className="text-blue-400">
            💡 <strong>Tip:</strong> To reply to this discussion, visit it on{' '}
            <a
              href={selectedDiscussion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              GitHub
            </a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">GitHub Discussions</h2>
        <p className="text-xl text-[var(--text-secondary)] mb-6">
          Join conversations directly from our GitHub repository
        </p>
      </section>

      {/* GitHub Token Setup */}
      {!githubToken && (
        <Card className="bg-yellow-500/20 border border-yellow-500/50">
          <p className="text-yellow-400 mb-4">
            🔐 <strong>Optional:</strong> Add a GitHub Personal Access Token to see more discussions and avoid rate limits.
          </p>
          {!showTokenInput ? (
            <Button
              onClick={() => setShowTokenInput(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
            >
              Add GitHub Token
            </Button>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="github_pat_XXXX..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <p className="text-xs text-gray-400">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  github.com/settings/tokens
                </a>
                {' '}with public_repo scope
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveToken}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex-1"
                >
                  Save Token
                </Button>
                <Button
                  onClick={() => {
                    setShowTokenInput(false);
                    setGithubToken('');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-500/20 border border-red-500/50">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
          </div>
          <p className="text-[var(--text-secondary)] mt-4">Loading discussions...</p>
        </div>
      ) : discussions.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-[var(--text-secondary)] mb-4">No discussions found</p>
          <a
            href={`https://github.com/burunndng/schema/discussions`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
          >
            Start one on GitHub →
          </a>
        </Card>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold mb-6 text-white">Categories</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-[var(--primary-500)] text-white'
                      : 'bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-600'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedCategory === category.slug
                        ? 'bg-[var(--primary-500)] text-white'
                        : 'bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-600'
                    }`}
                  >
                    <span>{category.emoji}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Statistics */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card className="text-center">
              <div className="text-4xl font-bold text-[var(--primary-500)]">{filteredDiscussions.length}</div>
              <p className="text-[var(--text-secondary)]">Discussions</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-[var(--accent-500)]">
                {filteredDiscussions.reduce((sum, d) => sum + d.comments, 0)}
              </div>
              <p className="text-[var(--text-secondary)]">Total Comments</p>
            </Card>
          </section>

          {/* Discussions List */}
          <section>
            <h3 className="text-2xl font-bold mb-6 text-white">
              {selectedCategory ? 'Discussions' : 'Recent Discussions'}
            </h3>
            <div className="space-y-4">
              {filteredDiscussions.map(discussion => (
                <div
                  key={discussion.id}
                  onClick={() => setSelectedDiscussion(discussion)}
                  className="cursor-pointer"
                >
                  <Card className="hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={discussion.author.avatarUrl}
                        alt={discussion.author.login}
                        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-white flex-grow">{discussion.title}</h4>
                          {discussion.isAnswered && (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                              ✓ Answered
                            </span>
                          )}
                          <span className="bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs px-2 py-1 rounded">
                            {discussion.category?.name}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          by <span className="font-semibold">{discussion.author.login}</span> •{' '}
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
                          {discussion.body.substring(0, 150)}...
                        </p>
                        <div className="flex gap-4 text-xs text-[var(--text-secondary)] items-center">
                          <span>💬 {discussion.comments} comments</span>
                          <a
                            href={discussion.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Join the Conversation</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Have a question or want to share an idea? Start a discussion on GitHub!
            </p>
            <a
              href="https://github.com/burunndng/schema/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start a Discussion on GitHub →
            </a>
          </section>
        </>
      )}
    </div>
  );
};

export default GitHubDiscussionsPage;
