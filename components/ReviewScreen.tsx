import React from 'react';
import { Answers, Test } from '../types';
import { LIKERT_SCALE_YSQ, LIKERT_SCALE_YPI, LIKERT_SCALE_SMI, LIKERT_SCALE_OI } from '../constants';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface ReviewScreenProps {
  answers: Answers;
  test: Test;
  onSubmit: () => void;
  onEdit: () => void;
  caregiverNames: { c1: string, c2: string };
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ answers, test, onSubmit, onEdit, caregiverNames }) => {
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
  
  const getAnswerLabel = (value: number) => {
      return likertScale.find(s => s.value === value)?.label || 'Not answered';
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4 text-center">Review Your Answers</h2>
      <p className="text-[var(--text-secondary)] mb-8 text-center">Please confirm your answers below. You can go back to make changes.</p>
      
      <div className="p-4 border border-[var(--border-color)] rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-gray-100">{test.title}</h3>
          <button 
            onClick={onEdit}
            className="text-sm text-[var(--primary-400)] hover:underline font-medium"
          >
            Edit
          </button>
        </div>
        
        {(test.type === 'YSQ' || test.type === 'SMI' || test.type === 'OI') && (
            <ul className="space-y-2">
            {test.questions.map(q => {
                const answerValue = answers[q.id];
                return (
                <li key={q.id} className="text-sm p-3 bg-gray-700/50 rounded-md">
                    <p className="text-[var(--text-secondary)]">{q.text}</p>
                    <p className="font-semibold text-[var(--primary-400)]">{answerValue} - {getAnswerLabel(answerValue)}</p>
                </li>
                );
            })}
            </ul>
        )}
        
        {test.type === 'YPI' && (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3">Question</th>
                            <th scope="col" className="px-4 py-3">{caregiverNames.c1}</th>
                            <th scope="col" className="px-4 py-3">{caregiverNames.c2}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {test.questions.map(q => {
                             const answer1 = answers[`${q.id}_c1`];
                             const answer2 = answers[`${q.id}_c2`];
                            return (
                                <tr key={q.id} className="border-b border-[var(--border-color)]">
                                    <td className="px-4 py-2 text-gray-200">{q.text}</td>
                                    <td className="px-4 py-2 font-medium text-[var(--primary-400)]">{answer1} - {getAnswerLabel(answer1)}</td>
                                    <td className="px-4 py-2 font-medium text-[var(--primary-400)]">{answer2} - {getAnswerLabel(answer2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )}

      </div>

      <div className="mt-8 text-center">
        <Button onClick={onSubmit}>
          Submit and See My Results
        </Button>
      </div>
    </Card>
  );
};

export default ReviewScreen;