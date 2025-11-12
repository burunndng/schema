import React from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { BurundangaLogo } from './BurundangaLogo';

interface HomePageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests' | 'forum' | 'discussions' | 'pricing' | 'testimonials' | 'auraos') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-6">
          <BurundangaLogo size="lg" className="text-[var(--primary-500)]" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Welcome to Burundanga
        </h2>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Discover deeper insights into your emotional patterns and relationship dynamics through our comprehensive Schema Therapy assessments.
        </p>
        <Button
          onClick={() => onNavigate('tests')}
          className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-8 py-3 text-lg"
        >
          Start Your Assessment
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="text-xl font-bold mb-2 text-white">Evidence-Based</h3>
          <p className="text-[var(--text-secondary)]">
            Our assessments are grounded in Schema Therapy, a proven therapeutic approach combining cognitive and psychodynamic principles.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Insights</h3>
          <p className="text-[var(--text-secondary)]">
            Receive personalized feedback powered by advanced AI to help you understand your results in depth.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-white">Comprehensive</h3>
          <p className="text-[var(--text-secondary)]">
            Multiple specialized tests to assess different aspects of emotional schemas and relationship patterns.
          </p>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to Explore Your Patterns?</h3>
        <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
          Our comprehensive suite of Schema Therapy assessments can help you gain valuable insights into your emotional and relational patterns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('services')}
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Learn About Our Services
          </Button>
          <Button
            onClick={() => onNavigate('tests')}
            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
          >
            Take a Test
          </Button>
        </div>
      </section>

      {/* Info Cards */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-3 text-white">What is Schema Therapy?</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Schema Therapy is an integrative form of psychotherapy that combines cognitive-behavioral, experiential, psychodynamic, and attachment theory approaches. It helps identify and work with deep emotional patterns called "schemas."
          </p>
          <Button
            onClick={() => onNavigate('about')}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)]"
          >
            Learn More →
          </Button>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-3 text-white">Our Assessments</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            We offer four specialized tests designed to evaluate different aspects of your emotional and relational patterns. Each assessment provides detailed insights and AI-powered interpretations.
          </p>
          <Button
            onClick={() => onNavigate('services')}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)]"
          >
            View Our Tests →
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
