import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { TESTS } from '../constants';

interface WelcomeScreenProps {
  onStart: (testId: number) => void;
  userName: string;
  onUserNameChange: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, userName, onUserNameChange }) => {
    
  const handleScrollToTests = () => {
    document.getElementById('test-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,white_10%,transparent_80%)]"></div>
        <div className="container mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center relative z-1">
          <div className="max-w-3xl mx-auto">
            <p className="text-base font-semibold leading-7 text-[var(--primary-500)]">Your Journey to Emotional Wellness</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Understand Yourself, Transform Your Life.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
              Embark on a path of self-discovery and healing with our Schema Therapy app. Learn to identify and address deep-rooted emotional patterns to foster healthier relationships and a more fulfilling life.
            </p>
             <div className="mt-8 max-w-md mx-auto">
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => onUserNameChange(e.target.value)}
                    placeholder="Enter your first name (optional)"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-[var(--border-color)] rounded-lg text-center text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition"
                />
            </div>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button
                onClick={handleScrollToTests}
                className="rounded-lg bg-[var(--primary-500)] px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-[var(--primary-600)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-500)] transition-transform transform hover:scale-105"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Test Selection Section */}
      <section id="test-selection" className="pt-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">Choose an Assessment</h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Each assessment offers unique insights into your emotional patterns. Start with the one that resonates most with you.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTS.map(test => (
            <Card key={test.id} className="text-left flex flex-col hover:border-[var(--primary-500)] transition-colors duration-300">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{test.title}</h2>
              <p className="text-[var(--text-secondary)] flex-grow mb-6 text-sm">{test.description}</p>
              <div className="mt-auto">
                <Button onClick={() => onStart(test.id)} className="w-full justify-center">
                  Start {test.type} Assessment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Disclaimer */}
       <div className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-md text-left">
        <p className="font-bold text-yellow-300">Important Disclaimer:</p>
        <p className="text-sm">This is an educational tool, not a diagnostic test. The results are not a substitute for a professional evaluation by a qualified therapist. Please consult a mental health professional for a proper assessment.</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;