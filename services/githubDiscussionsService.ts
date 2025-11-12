/**
 * GitHub Discussions Service
 * Fetches and manages GitHub Discussions from the repository
 */

const GITHUB_OWNER = 'burunndng';
const GITHUB_REPO = 'schema';
const GITHUB_API_URL = 'https://api.github.com';

export interface GitHubDiscussion {
  id: string;
  title: string;
  body: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: number;
  isAnswered: boolean;
  url: string;
}

export interface GitHubDiscussionCategory {
  name: string;
  description: string;
  slug: string;
  emoji: string;
}

class GitHubDiscussionsService {
  private token: string | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  /**
   * Fetch discussions using GraphQL
   */
  async getDiscussions(categorySlug?: string): Promise<GitHubDiscussion[]> {
    const cacheKey = `discussions_${categorySlug || 'all'}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const query = `
        query {
          repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPO}") {
            discussions(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                id
                title
                body
                category {
                  name
                  slug
                }
                author {
                  login
                  avatarUrl
                }
                createdAt
                updatedAt
                comments {
                  totalCount
                }
                isAnswered
                url
              }
            }
          }
        }
      `;

      const response = await fetch(`${GITHUB_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error('Failed to fetch discussions');
      }

      const discussions = result.data?.repository?.discussions?.nodes || [];

      // Filter by category if specified
      let filtered = discussions;
      if (categorySlug) {
        filtered = discussions.filter((d: any) => d.category?.slug === categorySlug);
      }

      // Transform the response
      const transformedDiscussions = filtered.map((discussion: any) => ({
        id: discussion.id,
        title: discussion.title,
        body: discussion.body,
        category: discussion.category,
        author: discussion.author,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
        comments: discussion.comments?.totalCount || 0,
        isAnswered: discussion.isAnswered,
        url: discussion.url,
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        data: transformedDiscussions,
        timestamp: Date.now(),
      });

      return transformedDiscussions;
    } catch (error) {
      console.error('Error fetching GitHub discussions:', error);
      return [];
    }
  }

  /**
   * Get available discussion categories
   */
  async getCategories(): Promise<GitHubDiscussionCategory[]> {
    const cacheKey = 'categories';

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const query = `
        query {
          repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPO}") {
            discussionCategories(first: 10) {
              nodes {
                id
                name
                description
                slug
                emoji
              }
            }
          }
        }
      `;

      const response = await fetch(`${GITHUB_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return [];
      }

      const categories = result.data?.repository?.discussionCategories?.nodes || [];

      // Cache the results
      this.cache.set(cacheKey, {
        data: categories,
        timestamp: Date.now(),
      });

      return categories;
    } catch (error) {
      console.error('Error fetching discussion categories:', error);
      return [];
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get a single discussion by ID
   */
  async getDiscussionById(id: string): Promise<GitHubDiscussion | null> {
    try {
      const query = `
        query {
          node(id: "${id}") {
            ... on Discussion {
              id
              title
              body
              category {
                name
                slug
              }
              author {
                login
                avatarUrl
              }
              createdAt
              updatedAt
              comments {
                totalCount
              }
              isAnswered
              url
            }
          }
        }
      `;

      const response = await fetch(`${GITHUB_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return null;
      }

      const discussion = result.data?.node;
      if (!discussion) return null;

      return {
        id: discussion.id,
        title: discussion.title,
        body: discussion.body,
        category: discussion.category,
        author: discussion.author,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
        comments: discussion.comments?.totalCount || 0,
        isAnswered: discussion.isAnswered,
        url: discussion.url,
      };
    } catch (error) {
      console.error('Error fetching discussion:', error);
      return null;
    }
  }
}

export const githubDiscussionsService = new GitHubDiscussionsService();
