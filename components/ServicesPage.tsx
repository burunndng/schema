import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface ServicesPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests') => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Our Assessment Services</h2>
        <p className="text-xl text-[var(--text-secondary)]">
          Comprehensive Schema Therapy evaluations with AI-powered insights
        </p>
      </section>

      {/* Introduction */}
      <section className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 rounded-lg p-8">
        <p className="text-[var(--text-secondary)] text-lg">
          Burundanga offers a suite of specialized assessments designed by Schema Therapy experts to help you understand your emotional patterns, coping mechanisms, and relationship dynamics. Each assessment is scientifically validated and provides detailed, AI-powered interpretations of your results.
        </p>
      </section>

      {/* Tests Grid */}
      <section className="space-y-8">
        <div className="bg-gray-800/50 rounded-lg p-8 border border-[var(--primary-500)]/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-bold mb-2 text-[var(--primary-500)]">Young Schema Questionnaire (YSQ)</h3>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                <p>⏱ Duration: 15-20 minutes</p>
                <p>📊 90 questions</p>
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-[var(--text-secondary)] mb-4">
                The foundational Schema Therapy assessment that evaluates your relationship with the 18 core maladaptive schemas. This comprehensive questionnaire measures how different schemas may be influencing your thoughts, feelings, and behaviors across various life domains.
              </p>
              <h4 className="font-bold text-white mb-2">You'll discover:</h4>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] mb-4">
                <li>Which schemas are most active in your life</li>
                <li>The intensity and frequency of each schema</li>
                <li>Patterns across different life areas</li>
                <li>Personalized insights and recommendations</li>
              </ul>
              <Button
                onClick={() => onNavigate('tests')}
                className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
              >
                Take YSQ Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-[var(--accent-500)]/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-bold mb-2 text-[var(--accent-500)]">Young Parenting Inventory (YPI)</h3>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                <p>⏱ Duration: 10-15 minutes</p>
                <p>📊 72 questions</p>
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-[var(--text-secondary)] mb-4">
                Explore how your childhood experiences with parents or caregivers shaped your current emotional patterns. This assessment identifies parenting styles and their lasting impact on your relationship dynamics and self-perception.
              </p>
              <h4 className="font-bold text-white mb-2">You'll understand:</h4>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] mb-4">
                <li>How each caregiver's parenting style affected you</li>
                <li>The origins of your core emotional patterns</li>
                <li>Connections between childhood and current relationships</li>
                <li>Healing insights based on your family history</li>
              </ul>
              <Button
                onClick={() => onNavigate('tests')}
                className="bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white"
              >
                Take YPI Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-bold mb-2 text-purple-500">Schema Mode Inventory (SMI)</h3>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                <p>⏱ Duration: 10-15 minutes</p>
                <p>📊 14 items</p>
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-[var(--text-secondary)] mb-4">
                Identify your current emotional "modes" or states - the different ways your personality expresses itself when triggered. This assessment reveals how you shift between vulnerable, angry, demanding, compliant, or self-protective modes.
              </p>
              <h4 className="font-bold text-white mb-2">You'll gain clarity on:</h4>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] mb-4">
                <li>Your dominant schema modes and their characteristics</li>
                <li>How different modes affect your relationships</li>
                <li>Your coping strategies and defense mechanisms</li>
                <li>Pathways to more balanced emotional functioning</li>
              </ul>
              <Button
                onClick={() => onNavigate('tests')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Take SMI Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-pink-500/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-bold mb-2 text-pink-500">Overcompensation Inventory (OI)</h3>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                <p>⏱ Duration: 10-15 minutes</p>
                <p>📊 36 questions</p>
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-[var(--text-secondary)] mb-4">
                Assess how you overcompensate for your underlying emotional vulnerabilities. This inventory reveals overcompensatory behaviors and coping strategies that may provide short-term relief but can create long-term challenges.
              </p>
              <h4 className="font-bold text-white mb-2">You'll discover:</h4>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] mb-4">
                <li>Your primary overcompensation patterns</li>
                <li>How you defend against vulnerability</li>
                <li>The impact of these patterns on your life</li>
                <li>Strategies for more authentic living</li>
              </ul>
              <Button
                onClick={() => onNavigate('tests')}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Take OI Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-white">Why Choose Burundanga?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-bold text-white mb-2">✓ Scientifically Validated</h4>
            <p className="text-[var(--text-secondary)]">
              All assessments are based on decades of Schema Therapy research and have proven reliability and validity.
            </p>
          </Card>

          <Card>
            <h4 className="font-bold text-white mb-2">✓ AI-Powered Insights</h4>
            <p className="text-[var(--text-secondary)]">
              Receive detailed, personalized interpretations powered by advanced artificial intelligence that goes beyond simple scoring.
            </p>
          </Card>

          <Card>
            <h4 className="font-bold text-white mb-2">✓ Comprehensive Results</h4>
            <p className="text-[var(--text-secondary)]">
              Get detailed reports with visual representations of your results, actionable insights, and next steps for growth.
            </p>
          </Card>

          <Card>
            <h4 className="font-bold text-white mb-2">✓ Privacy & Confidentiality</h4>
            <p className="text-[var(--text-secondary)]">
              Your data is treated with the utmost care. Complete the assessments with confidence and privacy protection.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to Gain Deeper Insights?</h3>
        <Button
          onClick={() => onNavigate('tests')}
          className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-8 py-3"
        >
          Start Your First Assessment
        </Button>
      </section>
    </div>
  );
};

export default ServicesPage;
