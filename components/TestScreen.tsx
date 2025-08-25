import React from 'react';
import { Test, Answers } from '../types';
import { LIKERT_SCALE_YSQ, LIKERT_SCALE_YPI, LIKERT_SCALE_SMI, LIKERT_SCALE_OI } from '../constants';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ProgressBar } from './common/ProgressBar';

interface TestScreenProps {
  test: Test;
  answers: Answers;
  onAnswer: (questionId: string, value: number, caregiver?: 'c1' | 'c2') => void;
  onNext: () => void;
  caregiverNames: { c1: string, c2: string };
  onCaregiverNamesChange: React.Dispatch<React.SetStateAction<{ c1: string; c2: string; }>>;
}

const AnswerButtons: React.FC<{
    questionId: string;
    likertScale: { value: number; label: string }[];
    selectedValue?: number;
    onClick: (value: number) => void;
}> = ({ questionId, likertScale, selectedValue, onClick }) => (
    <div className="flex flex-wrap gap-2 justify-center">
        {likertScale.map(({ value, label }) => (
            <button
                key={`${questionId}-${value}`}
                onClick={() => onClick(value)}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full text-sm sm:text-base font-bold transition-all duration-200 transform hover:scale-110
                ${selectedValue === value
                    ? 'bg-[var(--primary-500)] text-white shadow-lg scale-110'
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                aria-pressed={selectedValue === value}
                title={label}
            >
                {value}
            </button>
        ))}
    </div>
);

const TestScreen: React.FC<TestScreenProps> = ({ test, answers, onAnswer, onNext, caregiverNames, onCaregiverNamesChange }) => {
    
    const answeredCount = test.type === 'YPI'
        ? test.questions.filter(q => answers[`${q.id}_c1`] !== undefined && answers[`${q.id}_c2`] !== undefined).length
        : test.questions.filter(q => answers[q.id] !== undefined).length;
    
    const totalQuestions = test.questions.length;
    const isCompleted = answeredCount === totalQuestions;

    const getLikertScale = () => {
        switch(test.type) {
            case 'YSQ': return LIKERT_SCALE_YSQ;
            case 'YPI': return LIKERT_SCALE_YPI;
            case 'SMI': return LIKERT_SCALE_SMI;
            case 'OI': return LIKERT_SCALE_OI;
            default: return [];
        }
    };
    const likertScale = getLikertScale();

    const getInstructions = () => {
        switch(test.type) {
            case 'YSQ': return 'For each statement, please choose the option that best describes you.';
            case 'YPI': return 'Rate how well each statement describes your caregivers during your childhood.';
            case 'SMI': return 'Rate how well each statement describes you in the past few months, especially when distressed.';
            case 'OI': return 'Think about long-standing patterns in your life and rate how well each statement describes you.';
            default: return '';
        }
    };

    return (
    <Card>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{test.title}</h2>
      <p className="text-[var(--text-secondary)] mb-4">{getInstructions()}</p>
      
      <ProgressBar current={answeredCount} total={totalQuestions} />
      
      {test.type === 'YPI' && (
        <div className="my-6 p-4 bg-gray-900/50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="caregiver1" className="block text-sm font-medium text-[var(--text-secondary)]">Caregiver 1 Name</label>
                <input type="text" id="caregiver1" value={caregiverNames.c1} onChange={e => onCaregiverNamesChange(p => ({...p, c1: e.target.value}))} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)]" />
            </div>
            <div>
                <label htmlFor="caregiver2" className="block text-sm font-medium text-[var(--text-secondary)]">Caregiver 2 Name</label>
                <input type="text" id="caregiver2" value={caregiverNames.c2} onChange={e => onCaregiverNamesChange(p => ({...p, c2: e.target.value}))} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)]" />
            </div>
        </div>
      )}

      {(test.type === 'YSQ' || test.type === 'SMI' || test.type === 'OI') && (
        <div className="space-y-8 mt-6">
            {test.questions.map((question, index) => (
            <div key={question.id} className="border-t border-[var(--border-color)] pt-6">
                <p className="text-lg text-[var(--text-primary)] font-medium mb-4">{`${index + 1}. ${question.text}`}</p>
                <AnswerButtons
                    questionId={question.id}
                    likertScale={likertScale}
                    selectedValue={answers[question.id]}
                    onClick={(value) => onAnswer(question.id, value)}
                />
            </div>
            ))}
        </div>
      )}

      {test.type === 'YPI' && (
          <div className="mt-6 space-y-4">
              <div className="hidden md:grid grid-cols-3 gap-4 font-bold text-center text-[var(--text-secondary)]">
                  <div className="text-left">Question</div>
                  <div>{caregiverNames.c1}</div>
                  <div>{caregiverNames.c2}</div>
              </div>
              {test.questions.map((question, index) => (
                  <div key={question.id} className="border-t border-[var(--border-color)] pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <p className="text-[var(--text-primary)] font-medium md:col-span-1">{`${index + 1}. ${question.text}`}</p>
                      <div className="md:col-span-1">
                          <AnswerButtons questionId={`${question.id}_c1`} likertScale={likertScale} selectedValue={answers[`${question.id}_c1`]} onClick={value => onAnswer(question.id, value, 'c1')} />
                      </div>
                       <div className="md:col-span-1">
                           <AnswerButtons questionId={`${question.id}_c2`} likertScale={likertScale} selectedValue={answers[`${question.id}_c2`]} onClick={value => onAnswer(question.id, value, 'c2')} />
                      </div>
                  </div>
              ))}
          </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={onNext} disabled={!isCompleted}>
          Review Answers
        </Button>
      </div>
    </Card>
  );
};

export default TestScreen;
