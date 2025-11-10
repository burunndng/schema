import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface ForumPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'tests') => void;
}

interface Post {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  replies: number;
  views: number;
  upvotes: number;
  timeAgo: string;
  pinned?: boolean;
  surreal?: boolean;
}

const CategoryCard: React.FC<{ name: string; description: string; postCount: number; emoji: string; onSelect: () => void }> = ({
  name,
  description,
  postCount,
  emoji,
  onSelect,
}) => (
  <Card className="cursor-pointer hover:border-[var(--primary-500)] transition-all transform hover:-translate-y-1">
    <button onClick={onSelect} className="w-full text-left">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{emoji}</div>
        <span className="bg-[var(--primary-500)]/20 text-[var(--primary-500)] text-xs px-2 py-1 rounded">
          {postCount} posts
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{name}</h3>
      <p className="text-[var(--text-secondary)] text-sm">{description}</p>
    </button>
  </Card>
);

const PostPreview: React.FC<{ post: Post; onSelect: () => void }> = ({ post, onSelect }) => (
  <Card className="cursor-pointer hover:bg-gray-800/50 transition-colors">
    <button onClick={onSelect} className="w-full text-left">
      <div className="flex items-start gap-4">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`;
          }}
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white truncate flex-grow">{post.title}</h4>
            {post.pinned && <span className="text-yellow-400 text-sm">📌</span>}
            {post.surreal && <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-1 rounded">SURREAL</span>}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            by <span className="font-semibold">{post.author}</span> • {post.timeAgo}
          </p>
          <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">{post.content}</p>
          <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
            <span>💬 {post.replies} replies</span>
            <span>👁️ {post.views} views</span>
            <span>👍 {post.upvotes} upvotes</span>
          </div>
        </div>
      </div>
    </button>
  </Card>
);

const ThreadView: React.FC<{ post: Post; onBack: () => void }> = ({ post, onBack }) => (
  <div className="space-y-6">
    {/* Back Button */}
    <button
      onClick={onBack}
      className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
    >
      ← Back to {post.category}
    </button>

    {/* Original Post */}
    <Card className="border-l-4 border-[var(--primary-500)]">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`;
          }}
        />
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3>
          <p className="text-[var(--text-secondary)]">
            Posted by <span className="font-semibold">{post.author}</span> • {post.timeAgo}
          </p>
          {post.pinned && <p className="text-yellow-400 text-sm mt-1">📌 Pinned by moderator</p>}
        </div>
      </div>

      <p className="text-white mb-6 leading-relaxed">{post.content}</p>

      <div className="flex gap-6 text-sm border-t border-gray-700 pt-4">
        <button className="text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors">
          👍 Helpful ({post.upvotes})
        </button>
        <button className="text-[var(--text-secondary)] hover:text-white transition-colors">
          💬 Reply
        </button>
        <button className="text-[var(--text-secondary)] hover:text-white transition-colors">
          🔗 Share
        </button>
      </div>
    </Card>

    {/* Sample Replies */}
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-white">{post.replies} Replies</h4>
      <Card className="pl-8 border-l-2 border-gray-700">
        <div className="flex items-start gap-4">
          <img
            src="https://i.pravatar.cc/150?img=7"
            alt="Replier"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-grow">
            <p className="font-semibold text-white">Alex T. • 2 hours ago</p>
            <p className="text-[var(--text-secondary)] mt-2">
              Great question! I've been struggling with this too. The key is recognizing when your schema is triggered.
            </p>
            <button className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)] mt-3">
              👍 Helpful (14)
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const ForumPage: React.FC<ForumPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const categories = [
    {
      name: 'Schema Therapy 101',
      description: 'Questions and discussions about understanding schemas and getting started',
      emoji: '🧠',
      color: 'primary',
    },
    {
      name: 'Relationship Schemas',
      description: 'Discussing emotional patterns in relationships and how schemas affect connections',
      emoji: '💑',
      color: 'accent',
    },
    {
      name: 'Results & Interpretations',
      description: 'Help understanding your assessment results and what they mean',
      emoji: '📊',
      color: 'primary',
    },
    {
      name: 'Success Stories',
      description: 'Share your breakthroughs and personal growth journeys',
      emoji: '🌟',
      color: 'accent',
    },
    {
      name: 'Ask the Experts',
      description: 'Questions for our psychologists and researchers',
      emoji: '👨‍⚕️',
      color: 'primary',
    },
    {
      name: 'Off-Topic & Fun',
      description: 'Casual conversations and community building',
      emoji: '🎉',
      color: 'accent',
    },
  ];

  const posts: Post[] = [
    {
      id: 1,
      title: "Can schemas change? Or are we stuck with them forever?",
      author: 'Jordan P.',
      avatar: 'https://i.pravatar.cc/150?img=3',
      category: 'Schema Therapy 101',
      content:
        'I just got my YSQ results and found out I have pretty strong Abandonment schema. The report says schemas can change, but is that really true? Are they hardwired or can therapy actually rewire them?',
      replies: 24,
      views: 187,
      upvotes: 48,
      timeAgo: '3 hours ago',
      pinned: true,
    },
    {
      id: 2,
      title: "Why do I always pick unavailable partners? Schema insight",
      author: 'Casey M.',
      avatar: 'https://i.pravatar.cc/150?img=8',
      category: 'Relationship Schemas',
      content:
        'After taking the assessment, I realized I have both Abandonment and Unlovability schemas. Now I see the pattern - I pursue people who are emotionally unavailable because deep down I believe I\'m not worthy of genuine love. Has anyone else experienced this?',
      replies: 31,
      views: 298,
      upvotes: 127,
      timeAgo: '5 hours ago',
    },
    {
      id: 3,
      title: "My SMI results say I'm in 'Punitive Parent' mode - what does that mean?",
      author: 'Riley K.',
      avatar: 'https://i.pravatar.cc/150?img=11',
      category: 'Results & Interpretations',
      content:
        'The report mentions I frequently shift into "Punitive Parent" schema mode. It sounds negative, but I\'m not sure what it actually means for my behavior and relationships. Can someone explain?',
      replies: 8,
      views: 94,
      upvotes: 23,
      timeAgo: '1 day ago',
    },
    {
      id: 4,
      title: "BREAKTHROUGH: I finally understand why I self-sabotage!",
      author: 'Morgan D.',
      avatar: 'https://i.pravatar.cc/150?img=15',
      category: 'Success Stories',
      content:
        'I took the Burundanga assessment 3 months ago and it literally changed my life. I finally understand that my self-sabotaging behavior comes from deep Defectiveness schema. With this awareness, I\'ve been able to catch myself and make different choices. Feeling hopeful for the first time in years!',
      replies: 52,
      views: 412,
      upvotes: 287,
      timeAgo: '2 days ago',
      pinned: true,
    },
    {
      id: 5,
      title: 'My therapist wants to use my Burundanga results in our sessions',
      author: 'Taylor S.',
      avatar: 'https://i.pravatar.cc/150?img=18',
      category: 'Ask the Experts',
      content:
        'Dr. Eliza - would it be helpful to share my detailed assessment results with my therapist? I want to make sure they\'re useful and not misleading.',
      replies: 3,
      views: 67,
      upvotes: 12,
      timeAgo: '6 hours ago',
    },
    {
      id: 6,
      title: "I'm pretty sure my houseplant has a Demanding schema",
      author: 'Moonbeam S.',
      avatar: 'https://i.pravatar.cc/150?img=42',
      category: 'Off-Topic & Fun',
      content:
        'My fiddle leaf fig keeps knocking things off my desk when it doesn\'t get watered. Is this a schema issue? Does Burundanga make plant-specific assessments? Asking for a fern.',
      replies: 18,
      views: 156,
      upvotes: 89,
      timeAgo: '12 hours ago',
      surreal: true,
    },
    {
      id: 7,
      title: "Do schemas exist in parallel universes? Asking for research purposes",
      author: 'Zephyr T.',
      avatar: 'https://i.pravatar.cc/150?img=67',
      category: 'Off-Topic & Fun',
      content:
        'I took the Burundanga assessment and got my results. But then I thought - what if there\'s a version of me in an alternate dimension with completely different schemas? Should I assess all my multiverse selves?',
      replies: 42,
      views: 289,
      upvotes: 203,
      timeAgo: '18 hours ago',
      surreal: true,
    },
    {
      id: 8,
      title: "The connection between my Restrictive Emotional schema and my IBS",
      author: 'Quinn L.',
      avatar: 'https://i.pravatar.cc/150?img=22',
      category: 'Schema Therapy 101',
      content:
        'Has anyone else noticed that emotional suppression affects their physical health? I scored high on Restrictive Emotional and I\'ve realized my gut issues often spike when I\'m avoiding feelings.',
      replies: 15,
      views: 128,
      upvotes: 34,
      timeAgo: '1 day ago',
    },
  ];

  const categoryPosts: { [key: string]: Post[] } = {
    'Schema Therapy 101': posts.filter(p => p.category === 'Schema Therapy 101'),
    'Relationship Schemas': posts.filter(p => p.category === 'Relationship Schemas'),
    'Results & Interpretations': posts.filter(p => p.category === 'Results & Interpretations'),
    'Success Stories': posts.filter(p => p.category === 'Success Stories'),
    'Ask the Experts': posts.filter(p => p.category === 'Ask the Experts'),
    'Off-Topic & Fun': posts.filter(p => p.category === 'Off-Topic & Fun'),
  };

  if (selectedPost) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2 text-white">Community Forum</h2>
          <p className="text-[var(--text-secondary)]">Discussion Thread</p>
        </div>
        <ThreadView post={selectedPost} onBack={() => setSelectedPost(null)} />
      </div>
    );
  }

  if (selectedCategory) {
    const posts = categoryPosts[selectedCategory] || [];
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
          <p className="text-[var(--text-secondary)]">{posts.length} discussions</p>
        </div>

        <Button className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white">
          + Start New Discussion
        </Button>

        <div className="space-y-4">
          {posts.map(post => (
            <PostPreview
              key={post.id}
              post={post}
              onSelect={() => setSelectedPost(post)}
            />
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
        <Button className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-8 py-3">
          + Start a Discussion
        </Button>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-[var(--primary-500)]">2,847</div>
          <p className="text-[var(--text-secondary)]">Active Members</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-[var(--accent-500)]">12,394</div>
          <p className="text-[var(--text-secondary)]">Discussions</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-purple-500">48,921</div>
          <p className="text-[var(--text-secondary)]">Replies</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-pink-500">1,204</div>
          <p className="text-[var(--text-secondary)]">Success Stories</p>
        </Card>
      </section>

      {/* Forum Categories */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Forum Categories</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              postCount={categoryPosts[category.name]?.length || 0}
              emoji={category.emoji}
              onSelect={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>
      </section>

      {/* Recent Discussions */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Recent Discussions</h3>
        <div className="space-y-4">
          {posts.slice(0, 5).map(post => (
            <PostPreview
              key={post.id}
              post={post}
              onSelect={() => setSelectedPost(post)}
            />
          ))}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Community Guidelines</h3>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li>✓ Be respectful and kind to all members</li>
          <li>✓ Share experiences, not medical advice (always consult a therapist)</li>
          <li>✓ Keep discussions focused on schemas and mental health</li>
          <li>✓ No spam, self-promotion, or harassment</li>
          <li>✓ Have fun and support each other on this journey</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Join the Conversation</h3>
        <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
          Take an assessment and start connecting with others in our community. Share your insights, ask questions, and support fellow members on their journey of self-discovery.
        </p>
        <Button
          onClick={() => onNavigate('tests')}
          className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-8 py-3"
        >
          Start Your Assessment
        </Button>
      </section>
    </div>
  );
};

export default ForumPage;
