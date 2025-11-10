import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests') => void;
}

// Placeholder image component
const PlaceholderImage: React.FC<{ width: number; height: number; seed: string; label?: string }> = ({ width, height, seed, label }) => {
  const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];
  const color = colors[seed.charCodeAt(0) % colors.length];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
      }}
      className="text-white font-bold"
    >
      {label || '📷'}
    </div>
  );
};

// Quirky team member component
const TeamMember: React.FC<{ name: string; role: string; emoji: string; bio: string }> = ({ name, role, emoji, bio }) => (
  <Card className="text-center">
    <div className="mb-4 flex justify-center text-6xl">{emoji}</div>
    <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
    <p className="text-[var(--accent-500)] font-semibold mb-3">{role}</p>
    <p className="text-[var(--text-secondary)] text-sm">{bio}</p>
  </Card>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">About Burundanga</h2>
        <p className="text-xl text-[var(--text-secondary)]">
          Empowering self-discovery through evidence-based psychological assessments
        </p>
      </section>

      {/* Mission */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
        <p className="text-[var(--text-secondary)] text-lg">
          At Burundanga, we believe that understanding yourself is the first step toward meaningful personal growth and healthier relationships. Our mission is to provide accessible, evidence-based Schema Therapy assessments that help individuals gain insight into their emotional patterns and relationship dynamics. We combine rigorous psychological science with modern technology to deliver personalized, actionable insights.
        </p>
      </section>

      {/* Vision & Values */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-3 text-white">Our Vision</h3>
          <p className="text-[var(--text-secondary)]">
            To make psychological self-assessment tools accessible, understandable, and empowering for everyone seeking to understand their emotional and relational patterns.
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-3 text-white">Evidence-Based</h3>
          <p className="text-[var(--text-secondary)]">
            All our assessments are based on decades of Schema Therapy research and psychological science. We're committed to accuracy and validity.
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-3 text-white">User-Centered</h3>
          <p className="text-[var(--text-secondary)]">
            Your privacy, comfort, and understanding matter. We design our platform to be intuitive, supportive, and easy to navigate.
          </p>
        </Card>
      </section>

      {/* Schema Therapy Explanation */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Understanding Schema Therapy</h3>

        <div className="space-y-6">
          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">What is a Schema?</h4>
            <p className="text-[var(--text-secondary)]">
              Schemas are deeply ingrained, recurring patterns of thinking, feeling, and behaving that develop from our early life experiences. They influence how we perceive ourselves, relate to others, and interpret the world around us. While schemas can be helpful, maladaptive schemas can cause significant emotional distress and relationship difficulties.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">How Schema Therapy Works</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              Schema Therapy integrates multiple therapeutic approaches:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>Cognitive-Behavioral techniques to identify and challenge unhelpful thought patterns</li>
              <li>Experiential methods to access and modify deep emotional patterns</li>
              <li>Psychodynamic insights to understand how past relationships shape current behavior</li>
              <li>Attachment theory principles to recognize relational patterns</li>
            </ul>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">The 18 Core Schemas</h4>
            <p className="text-[var(--text-secondary)]">
              Schema Therapy identifies 18 maladaptive schemas organized into five domains: disconnection and rejection, impaired autonomy and performance, impaired limits, other-directedness, and overvigilance and inhibition. Our Young Schema Questionnaire assessment helps identify which of these schemas may be active in your life.
            </p>
          </Card>
        </div>
      </section>

      {/* About Us Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">About Burundanga</h3>

        <Card className="mb-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-bold mb-4 text-white">Our Story</h4>
              <p className="text-[var(--text-secondary)] mb-4">
                Founded in 2019, Burundanga emerged from a simple vision: to democratize access to evidence-based psychological assessments. Our team of psychologists, technologists, and mental health advocates recognized that Schema Therapy—one of the most effective therapeutic approaches—was underutilized due to limited assessment accessibility.
              </p>
              <p className="text-[var(--text-secondary)] mb-4">
                We built Burundanga to bridge that gap. By combining rigorous psychological science with modern AI technology, we've created a platform that makes comprehensive Schema Therapy assessments available to anyone, anywhere, at any time.
              </p>
              <p className="text-[var(--text-secondary)]">
                Today, thousands of individuals have used our assessments to gain profound insights into their emotional patterns and relationship dynamics. We're proud to be at the forefront of making psychological self-discovery accessible, affordable, and empowering.
              </p>
            </div>
            <div className="flex justify-center">
              <svg viewBox="0 0 400 300" width="400" height="300" className="w-full max-w-sm">
                {/* Building */}
                <rect x="50" y="100" width="300" height="180" fill="#6366f1" />
                {/* Roof */}
                <polygon points="50,100 200,20 350,100" fill="#4f46e5" />
                {/* Door */}
                <rect x="180" y="220" width="40" height="60" fill="#1f2937" />
                {/* Door handle */}
                <circle cx="215" cy="250" r="3" fill="#fbbf24" />
                {/* Windows */}
                {[70, 150, 230, 310].map((x) => (
                  <g key={x}>
                    <rect x={x} y="130" width="30" height="30" fill="#bfdbfe" />
                    <line x1={x + 15} y1="130" x2={x + 15} y2="160" stroke="#1f2937" strokeWidth="1" />
                    <line x1={x} y1="145" x2={x + 30} y2="145" stroke="#1f2937" strokeWidth="1" />
                  </g>
                ))}
                {[70, 150, 230, 310].map((x) => (
                  <g key={`w2-${x}`}>
                    <rect x={x} y="180" width="30" height="30" fill="#bfdbfe" />
                    <line x1={x + 15} y1="180" x2={x + 15} y2="210" stroke="#1f2937" strokeWidth="1" />
                    <line x1={x} y1="195" x2={x + 30} y2="195" stroke="#1f2937" strokeWidth="1" />
                  </g>
                ))}
                {/* Ground */}
                <rect x="0" y="280" width="400" height="20" fill="#34d399" />
                {/* Flowers */}
                <circle cx="80" cy="270" r="5" fill="#ec4899" />
                <rect x="78" y="270" width="4" height="10" fill="#22c55e" />
                <circle cx="320" cy="270" r="5" fill="#ec4899" />
                <rect x="318" y="270" width="4" height="10" fill="#22c55e" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-[var(--primary-500)]/5 to-[var(--accent-500)]/5">
          <h4 className="text-lg font-bold mb-3 text-white">Why Burundanga?</h4>
          <p className="text-[var(--text-secondary)] mb-4">
            The name "Burundanga" is derived from the historical term for a plant-based substance used in ancient cultures to enhance perception and awareness. We chose this name to reflect our mission: to help you perceive yourself more clearly and become aware of the deeper patterns shaping your life.
          </p>
          <p className="text-[var(--text-secondary)]">
            It represents the transformation—both ancient wisdom and modern science working together to create genuine self-understanding.
          </p>
        </Card>
      </section>

      {/* Team Section */}
      <section>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-3 text-white">Meet Our Team</h3>
          <p className="text-[var(--text-secondary)]">
            A passionate group of psychologists, technologists, and mental health advocates dedicated to your self-discovery
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <TeamMember
            name="Dr. Eliza Quirk"
            role="Chief Psychologist"
            emoji="🤓"
            bio="Ph.D. in Schema Therapy with 15 years of clinical experience. Collects vintage psychology textbooks and speaks to her plants."
          />

          <TeamMember
            name="Marcus Chen"
            role="CTO & Co-founder"
            emoji="🧠"
            bio="AI specialist obsessed with making psychology accessible. Codes in pajamas and believes algorithms can understand emotions."
          />

          <TeamMember
            name="Zara Moonstone"
            role="Head of Research"
            emoji="🔮"
            bio="Conducts groundbreaking studies on emotional patterns. Practices meditation, tarot reading, and believes the universe speaks in schemas."
          />

          <TeamMember
            name="Professor Oink"
            role="Head of User Experience"
            emoji="🐷"
            bio="Former designer turned UX visionary. Approaches every project with pig-headed determination and designs with empathy. Loves mud."
          />

          <TeamMember
            name="Dr. Sheldon Brooks"
            role="Head of Data Science"
            emoji="🦖"
            bio="Dinosaur enthusiast (literally collects fossils). Believes understanding emotions is like understanding extinction events: complex and fascinating."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to Learn More About Yourself?</h3>
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

export default AboutPage;
