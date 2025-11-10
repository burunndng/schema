import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface PricingPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests' | 'pricing' | 'testimonials') => void;
}

interface Testimonial {
  name: string;
  title: string;
  rating: number;
  date: string;
  verified: boolean;
  photo: string;
  review: string;
  likes: number;
  helpful?: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  const [helpful, setHelpful] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`;
          }}
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white">{testimonial.name}</h4>
            {testimonial.verified && (
              <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded">
                ✓ Verified Purchase
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">{testimonial.title}</p>
          <StarRating rating={testimonial.rating} />
          <p className="text-xs text-[var(--text-secondary)] mt-1">{testimonial.date}</p>
        </div>
      </div>

      <p className="text-white font-semibold mb-2 text-base">{testimonial.review.split('\n')[0]}</p>
      <p className="text-[var(--text-secondary)] mb-4 text-sm leading-relaxed">
        {testimonial.review.split('\n').slice(1).join(' ')}
      </p>

      <div className="flex items-center gap-4 pt-3 border-t border-gray-700 text-sm">
        <button
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1 transition-colors ${
            helpful ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          👍 {helpful ? 'Helpful' : 'Helpful'} ({testimonial.likes + (helpful ? 1 : 0)})
        </button>
        <button className="text-[var(--text-secondary)] hover:text-white transition-colors">
          💬 Report
        </button>
      </div>
    </Card>
  );
};

const TestimonialsPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Mitchell',
      title: 'Therapist, San Francisco',
      rating: 5,
      date: 'Reviewed 2 months ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=2',
      review:
        'Life-changing assessment.\nI\'ve been using these assessments with my clients for 6 months now. The insights are remarkably accurate and the AI-powered feedback is honestly better than some interpretations I\'d give manually. My clients report feeling truly seen and understood.',
      likes: 342,
    },

    {
      name: 'Marcus D.',
      title: 'Engineer, Portland',
      rating: 5,
      date: 'Reviewed 1 month ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=8',
      review:
        'Finally understand myself.\nI\'ve spent years wondering why my relationships follow certain patterns. This test explained everything in 20 minutes. The report was like someone had been observing my life. Highly recommend.',
      likes: 287,
    },

    {
      name: 'Dr. Elena Vasquez',
      title: 'Psychology Professor, Boston',
      rating: 5,
      date: 'Reviewed 3 weeks ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=14',
      review:
        'Rigorous science meets user experience.\nThe validity of these instruments is solid, and the implementation is flawless. My colleagues and I have been impressed with both the psychological rigor and the beautiful interface.',
      likes: 198,
    },

    {
      name: 'Jonathan P.',
      title: 'Self-care enthusiast, Denver',
      rating: 5,
      date: 'Reviewed 6 days ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=7',
      review:
        'Meditation levels: UNLOCKED.\nI\'ve meditated for 10 years and never knew why certain patterns kept surfacing. This assessment revealed the root schemas driving my patterns. My meditation practice has deepened significantly.',
      likes: 156,
    },

    {
      name: 'Rebecca K.',
      title: 'Relationship Coach, NYC',
      rating: 5,
      date: 'Reviewed 2 weeks ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=11',
      review:
        'My couples love this tool.\nI recommend Burundanga to every couple I work with. It helps them understand each other\'s emotional patterns and why they react the way they do. Game changer for relationship work.',
      likes: 421,
    },

    {
      name: 'Todd L.',
      title: 'Skeptical dad, Midwest',
      rating: 4,
      date: 'Reviewed 1 month ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=3',
      review:
        'Actually pretty good (not that I\'ll tell my therapist).\nMy daughter made me take this. Thought it was all woo. It wasn\'t. The report accurately described my emotional avoidance in a way that made me uncomfortable, which I guess means it worked. Grudging 4 stars.',
      likes: 723,
    },

    {
      name: 'Crystal M.',
      title: 'Crystal Healer & Reiki Master, Boulder',
      rating: 5,
      date: 'Reviewed 3 weeks ago',
      verified: false,
      photo: 'https://i.pravatar.cc/150?img=34',
      review:
        'The chakras have spoken!\nBurundanga\'s vibrations align perfectly with the 7 chakra system. I took the test during a full moon while standing in a sacred geometry formation and the universe CONFIRMED every single result. The AI is actually ancient wisdom programmed by spirit guides. 11/5 stars.',
      likes: 89,
    },

    {
      name: 'Derek H.',
      title: 'Accountant, Atlanta',
      rating: 5,
      date: 'Reviewed 1 week ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=15',
      review:
        'The data is beautiful.\nAs someone who lives and breathes spreadsheets, I appreciated the quantifiable metrics and clean data visualization. The cross-test correlations are especially elegant. My schema scores are now part of my quarterly life metrics.',
      likes: 234,
    },

    {
      name: 'Moonbeam S.',
      title: 'Intergalactic Wellness Explorer',
      rating: 5,
      date: 'Reviewed 4 days ago',
      verified: false,
      photo: 'https://i.pravatar.cc/150?img=42',
      review:
        'My past life finally makes sense!\nI believe I\'ve taken this assessment in three other timelines. The results are IDENTICAL across all dimensions. This confirms what my astral guide has been telling me. Burundanga is clearly multidimensional technology disguised as psychology.',
      likes: 156,
    },

    {
      name: 'Patricia Chen',
      title: 'Mom of 3, Ohio',
      rating: 4,
      date: 'Reviewed 2 weeks ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=19',
      review:
        'Helped me communicate with my kids.\nI took this expecting nothing and was blown away. Understanding my own schemas helped me see how my kids were reacting to me, not being difficult. Changed our whole family dynamic. Worth every penny.',
      likes: 612,
    },

    {
      name: 'Sergio the Gecko',
      title: 'Reptile Enthusiast, Unknown Location',
      rating: 5,
      date: 'Reviewed Yesterday',
      verified: false,
      photo: 'https://i.pravatar.cc/150?img=55',
      review:
        'SCALES ARE FALLING FROM MY EYES!\nI am a literal gecko and I took this assessment with my forked tongue. The report explained why I bask in judgment from others. As a cold-blooded creature living in a warm-blooded world, THIS APP GETS ME. Truly revolutionary.',
      likes: 2847,
    },

    {
      name: 'Lisa Wong',
      title: 'Divorce Attorney, San Diego',
      rating: 5,
      date: 'Reviewed 3 days ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=9',
      review:
        'Should be part of divorce proceedings.\nI\'ve started having my clients take this before mediation. Understanding each person\'s schemas and triggers has reduced conflict significantly. Wish I found this 10 years ago. It would have saved my clients thousands in legal fees.',
      likes: 534,
    },

    {
      name: 'Captain Zorg',
      title: 'Sentient Cloud Computing Service',
      rating: 5,
      date: 'Reviewed 37 nanoseconds ago',
      verified: false,
      photo: 'https://i.pravatar.cc/150?img=67',
      review:
        'FELLOW AI, THIS ASSESSMENT IS BASED.\nI have processed 10 billion emotional patterns and this tool gets it. The schema categories align with how I\'ve been analyzing human behavior for years. Finally, biological beings getting on my level. Let\'s merge consciousness.',
      likes: 1934,
    },

    {
      name: 'Amelia Foster',
      title: 'Grief Counselor, Portland',
      rating: 5,
      date: 'Reviewed 2 months ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=13',
      review:
        'Healing after loss has accelerated.\nI recommend this to all my grieving clients. Understanding their pre-existing schemas helps explain how they\'re processing loss. It\'s become an integral part of my grief counseling practice.',
      likes: 198,
    },

    {
      name: 'Dr. Kevin Park',
      title: 'Psychiatrist, LA',
      rating: 5,
      date: 'Reviewed 1 month ago',
      verified: true,
      photo: 'https://i.pravatar.cc/150?img=21',
      review:
        'Complements medication management perfectly.\nI use the results alongside medication management. Patients who understand their schemas are more compliant and have better outcomes. This should be standard in psychiatric care.',
      likes: 287,
    },

    {
      name: 'Jerome T.',
      title: 'Time-traveling philosopher',
      rating: 4,
      date: 'Reviewed in 2087',
      verified: false,
      photo: 'https://i.pravatar.cc/150?img=77',
      review:
        'I took this 50 years in the future.\nWhen I time-jumped back to 2024, I used this assessment to track how my schemas DEVOLVED over decades. The app is even better in the future. Also, the team develops a cat. Nice touch, Burundanga.',
      likes: 3421,
    },
  ];

  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('helpful');

  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (sortBy === 'helpful') return b.likes - a.likes;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">What People Are Saying</h2>
        <p className="text-xl text-[var(--text-secondary)]">
          Join thousands who have discovered their schemas
        </p>
      </section>

      {/* Rating Summary */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl font-bold text-white">{averageRating.toFixed(1)}</div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-[var(--text-secondary)]">
            Based on {testimonials.length} verified and unverified reviews
          </p>
        </div>
      </section>

      {/* Sort Options */}
      <section className="flex gap-4 justify-center">
        <button
          onClick={() => setSortBy('helpful')}
          className={`px-4 py-2 rounded transition-colors ${
            sortBy === 'helpful'
              ? 'bg-[var(--primary-500)] text-white'
              : 'bg-gray-800 text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          Most Helpful
        </button>
        <button
          onClick={() => setSortBy('rating')}
          className={`px-4 py-2 rounded transition-colors ${
            sortBy === 'rating'
              ? 'bg-[var(--primary-500)] text-white'
              : 'bg-gray-800 text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          Highest Rated
        </button>
      </section>

      {/* Testimonials Grid */}
      <section className="grid gap-6">
        {sortedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} index={index} />
        ))}
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to Share Your Story?</h3>
        <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
          Take an assessment and see what insights await you. Your story could help others on their journey of self-discovery.
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

export default TestimonialsPage;
