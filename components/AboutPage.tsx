import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests') => void;
}

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
