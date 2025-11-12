import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface PricingPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'tests' | 'pricing' | 'testimonials' | 'forum' | 'auraos') => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h2>
        <p className="text-xl text-[var(--text-secondary)] mb-6">
          Choose the right plan for your mental health journey
        </p>
      </section>

      {/* Pricing Cards */}
      <section>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Single Test Plan */}
          <Card className="border-2 border-[var(--text-secondary)]">
            <h3 className="text-2xl font-bold mb-2 text-white">Single Test</h3>
            <p className="text-[var(--text-secondary)] mb-6">Perfect for exploring one area</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$14.99</span>
              <p className="text-[var(--text-secondary)] text-sm">per assessment</p>
            </div>

            <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
              <li className="flex items-start">
                <span className="text-[var(--primary-500)] mr-3">✓</span>
                <span>One complete assessment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--primary-500)] mr-3">✓</span>
                <span>Detailed personalized report</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--primary-500)] mr-3">✓</span>
                <span>AI-powered insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--primary-500)] mr-3">✓</span>
                <span>7-day report access</span>
              </li>
              <li className="flex items-start text-gray-500">
                <span className="mr-3">✗</span>
                <span>No retakes</span>
              </li>
            </ul>

            <Button
              onClick={() => onNavigate('tests')}
              className="w-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
            >
              Choose Test
            </Button>
          </Card>

          {/* Combo Plan (Most Popular) */}
          <Card className="border-4 border-[var(--primary-500)] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[var(--primary-500)] text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white">Complete Suite</h3>
            <p className="text-[var(--text-secondary)] mb-6">All tests in one package</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$49.99</span>
              <p className="text-[var(--text-secondary)] text-sm">one-time payment</p>
            </div>

            <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>All 4 assessments (YSQ, YPI, SMI, OI)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>Comprehensive reports for each test</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>Cross-test analysis & insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>Unlimited report access (30 days)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>One free retake per test</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent-500)] mr-3">✓</span>
                <span>Email support</span>
              </li>
            </ul>

            <Button
              onClick={() => onNavigate('tests')}
              className="w-full bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-bold"
            >
              Get Complete Suite
            </Button>
          </Card>

          {/* Subscription Plan */}
          <Card className="border-2 border-purple-500/50">
            <h3 className="text-2xl font-bold mb-2 text-white">Annual Subscription</h3>
            <p className="text-[var(--text-secondary)] mb-6">Best value for ongoing growth</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$99.99</span>
              <p className="text-[var(--text-secondary)] text-sm">per year (20% savings)</p>
            </div>

            <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Everything in Complete Suite</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Unlimited retakes on all tests</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Quarterly reassessments included</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Priority email & chat support</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Access to exclusive research reports</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">✓</span>
                <span>Personal progress tracking</span>
              </li>
            </ul>

            <Button
              onClick={() => onNavigate('tests')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Subscribe Now
            </Button>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h3 className="text-2xl font-bold mb-8 text-center text-white">Common Questions</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">Can I try before buying?</h4>
            <p className="text-[var(--text-secondary)]">
              Absolutely! We offer a free preview of the first 5 questions from any assessment so you can get a feel for the experience before committing.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">What's your refund policy?</h4>
            <p className="text-[var(--text-secondary)]">
              We offer a 30-day money-back guarantee. If you're not satisfied with your assessment results, we'll refund your purchase.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">Can I share my results?</h4>
            <p className="text-[var(--text-secondary)]">
              Yes! You can download your reports as PDF and share them with your therapist, counselor, or loved ones. Your privacy is always protected.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">Do you offer therapist discounts?</h4>
            <p className="text-[var(--text-secondary)]">
              Yes! We have special pricing for mental health professionals and organizations. Contact our team for details.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">How accurate are these tests?</h4>
            <p className="text-[var(--text-secondary)]">
              Our assessments are based on validated Schema Therapy instruments used in clinical research. Accuracy depends on your honest responses.
            </p>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-3 text-white">What if I need help interpreting results?</h4>
            <p className="text-[var(--text-secondary)]">
              Our AI provides detailed interpretations, and subscription members have access to email support. We also recommend discussing results with a therapist.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to Begin Your Journey?</h3>
        <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
          Choose your plan and start gaining insights into your emotional patterns today. All plans come with our satisfaction guarantee.
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

export default PricingPage;
