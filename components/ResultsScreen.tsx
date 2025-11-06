import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { TestResult, YSCTestResult, YPITestResult, OITestResult, SMITestResult, Schema, Question, TestType, AllFeedback, GeminiFeedback, GeminiSMIFeedback, GeminiOIFeedback, GeminiParentingFeedback, ChatMessage, Test, Answers } from '../types';
import { SCHEMA_DEFINITIONS, SMI_MODE_DETAILS, OI_CATEGORY_DEFINITIONS, YPI_CATEGORY_DEFINITIONS, YPI_QUESTION_TO_CATEGORY_MAP, TESTS } from '../constants';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { FullReport } from './FullReport';
import { getChatbotResponse } from '../services/geminiService';


interface ResultsScreenProps {
  currentResult: TestResult;
  allResults: Partial<Record<TestType, TestResult>>;
  onReset: () => void;
  caregiverNames: { c1: string, c2: string };
  userName: string;
  currentTest: Test | null;
  answers: Answers;
}

const ScoreBar: React.FC<{ label: string; score: number; maxScore: number; }> = ({ label, score, maxScore }) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    let colorClasses = 'bg-green-500 text-green-300';
    if (score / maxScore >= 0.8) { // e.g., 5/6
        colorClasses = 'bg-red-500 text-red-300';
    } else if (score / maxScore >= 0.6) { // e.g., 4/6
        colorClasses = 'bg-orange-500 text-orange-300';
    } else if (score / maxScore >= 0.4) { // e.g., 3/6
        colorClasses = 'bg-yellow-500 text-yellow-300';
    }

    return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1">
            <div className="text-sm font-medium text-[var(--text-secondary)] truncate">{label}</div>
            <div className="h-4 w-full rounded-full bg-gray-700">
                <div className={`h-4 rounded-full ${colorClasses.split(' ')[0]}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <div className={`text-sm font-bold ${colorClasses.split(' ')[1]}`}>{score.toFixed(1)}</div>
        </div>
    );
};


const YSQResultsDisplay: React.FC<{ results: YSCTestResult }> = ({ results }) => {
    const { scores, totalScore, feedback } = results;
    const prominentSchemas = scores.filter(s => s.score >= 4).sort((a, b) => b.score - a.score);

    const getInterpretation = (score: number) => {
        if (score <= 40) return { text: "Low Presence of Maladaptive Schemas", color: "text-green-400" };
        if (score <= 80) return { text: "Moderate Presence of Maladaptive Schemas", color: "text-yellow-400" };
        return { text: "High Presence of Maladaptive Schemas", color: "text-red-400" };
    };
    const interpretation = getInterpretation(totalScore);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">Schema Quiz Results</h1>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">Here's a breakdown of your results and what they might mean.</p>
            </div>

            <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Your Schema Scores</h2>
                <div className="space-y-4">
                    {scores.map(({ schema, score }) => (
                        <ScoreBar key={schema} label={schema} score={score} maxScore={6} />
                    ))}
                </div>
                 <div className="mt-6 flex flex-col justify-center rounded-lg bg-gray-900/50 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className={`text-lg font-semibold ${interpretation.color}`}>{interpretation.text}</h3>
                        <p className="mt-2 text-sm text-gray-400">This suggests how much these patterns may be influencing your thoughts, feelings, and behaviors.</p>
                    </div>
                    <div className="mt-4 flex items-center justify-center md:mt-0 md:ml-6">
                        <p className="text-sm font-medium text-gray-500">Total Score</p>
                        <p className="ml-4 text-5xl font-bold text-white">{totalScore}</p>
                    </div>
                </div>
            </Card>

            {prominentSchemas.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">Understanding Your Prominent Schemas</h2>
                    <Card className="divide-y divide-[var(--border-color)] !p-0">
                        {prominentSchemas.map(({ schema, score }) => (
                            <div key={schema} className="p-6">
                                <h3 className="text-lg font-semibold text-white">{schema}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Score: <span className="font-bold"> {score} (High)</span></p>
                                <p className="mt-3 text-sm text-gray-300">{SCHEMA_DEFINITIONS[schema]}</p>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
            
            {feedback && <GeminiFeedbackDisplay feedback={feedback} />}
        </div>
    );
};

const SMIResultsDisplay: React.FC<{ results: SMITestResult }> = ({ results }) => {
    const { scores, feedback } = results;
    const sortedScores = [...scores].sort((a,b) => b.score - a.score);

    return (
         <div className="space-y-8">
            <div className="text-center">
                <p className="text-sm font-semibold text-[var(--primary-400)]">Schema Mode Inventory (SMI)</p>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Your Mode Scores</h1>
                <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
                   Modes with scores of 4.0 or higher are considered dominant.
                </p>
            </div>
            
            <Card>
                 <div className="space-y-4">
                    {sortedScores.map(({ mode, score }) => (
                        <ScoreBar key={mode} label={mode} score={score} maxScore={6} />
                    ))}
                </div>
            </Card>
            
            {feedback && <GeminiFeedbackDisplay feedback={feedback} />}
        </div>
    );
};

const YPIResultsDisplay: React.FC<{ results: YPITestResult, caregiverNames: { c1: string, c2: string } }> = ({ results, caregiverNames }) => {
    const { scores, feedback } = results;

    const CaregiverResultCard = ({ name, result }: { name: string, result: Record<string, Question[]> }) => {
        const hasPatterns = Object.values(result).some(arr => arr.length > 0);
        return(
            <Card>
                <h3 className="text-xl font-bold mb-6 text-center text-[var(--text-primary)]">{name}</h3>
                {hasPatterns ? (
                     <div className="space-y-4">
                        {Object.entries(result).map(([cat, questions]) => {
                           if (questions.length === 0) return null;
                           const maxScore = Object.values(YPI_QUESTION_TO_CATEGORY_MAP).filter(c => c === cat).length;
                           return <ScoreBar key={cat} label={cat} score={questions.length} maxScore={maxScore} />
                        })}
                    </div>
                ): (
                    <p className="text-[var(--text-secondary)] text-center py-8">No prominent negative patterns identified.</p>
                )}
            </Card>
        );
    }
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Parenting Inventory Results</h1>
                 <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
                    This report highlights patterns where you rated a caregiver "4" or higher.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CaregiverResultCard name={caregiverNames.c1} result={scores.caregiver1} />
                <CaregiverResultCard name={caregiverNames.c2} result={scores.caregiver2} />
            </div>

            {feedback && <GeminiFeedbackDisplay feedback={feedback} />}
        </div>
    );
};

const OIResultsDisplay: React.FC<{ results: OITestResult }> = ({ results }) => {
    const { scores, feedback } = results;
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Overcompensation Results</h1>
                 <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
                    This report highlights your most prominent overcompensation patterns.
                </p>
            </div>
            <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Your Overcompensation Patterns</h2>
                <div className="space-y-4">
                     {scores.map(({ category, score }) => (
                        <ScoreBar key={category} label={category} score={score} maxScore={6} />
                    ))}
                </div>
            </Card>
            {feedback && <GeminiFeedbackDisplay feedback={feedback} />}
        </div>
    );
};


const GeminiFeedbackDisplay = ({ feedback }: { feedback: AllFeedback }) => {
    // Type Guards
    const isYsq = (fb: AllFeedback): fb is GeminiFeedback => 'topSchemas' in fb;
    const isSmi = (fb: AllFeedback): fb is GeminiSMIFeedback => 'topModes' in fb;
    const isOi = (fb: AllFeedback): fb is GeminiOIFeedback => 'topPatterns' in fb;
    const isYpi = (fb: AllFeedback): fb is GeminiParentingFeedback => 'caregiver1Feedback' in fb;
    
    const renderContent = () => {
        if (isYsq(feedback)) {
            return feedback.topSchemas.map((schemaFeedback, index) => (
                <div key={index} className="p-5 bg-gray-800/50 border-l-4 border-[var(--primary-500)] rounded-r-lg">
                    <h4 className="text-lg font-semibold text-[var(--primary-300)] mb-2">{schemaFeedback.schemaName}</h4>
                    <p className="text-gray-400 italic mb-4">"{schemaFeedback.explanation}"</p>
                    <p className="font-semibold text-sm text-gray-300">Points for Reflection:</p>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 mt-2 text-sm">
                        {schemaFeedback.reflectionPoints.map((point: string, i: number) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
            ));
        }
        if (isSmi(feedback)) {
            return (
                <>
                    {feedback.topModes.map((modeFeedback, index) => (
                        <div key={index} className="p-5 bg-gray-800/50 border-l-4 border-[var(--primary-500)] rounded-r-lg">
                            <h4 className="text-lg font-semibold text-[var(--primary-300)] mb-2">{modeFeedback.modeName}</h4>
                            <p className="text-gray-400 italic mb-4">"{modeFeedback.explanation}"</p>
                            <p className="font-semibold text-sm text-gray-300">Points for Reflection:</p>
                            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 mt-2 text-sm">
                                {modeFeedback.reflectionPoints.map((point: string, i: number) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                    <div className="p-5 bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                         <h4 className="text-lg font-semibold text-green-300 mb-2">Healthy Adult Mode (Score: {feedback.healthyAdult.score.toFixed(2)})</h4>
                         <p className="text-green-400 text-sm">{feedback.healthyAdult.commentary}</p>
                    </div>
                     <div className="p-5 bg-gray-700/50 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-200 mb-2">How Your Modes Might Interact</h4>
                        <p className="text-[var(--text-secondary)] text-sm">{feedback.interaction}</p>
                    </div>
                </>
            );
        }
        if (isOi(feedback)) {
             return feedback.topPatterns.map((patternFeedback, index) => (
                <div key={index} className="p-5 bg-gray-800/50 border-l-4 border-[var(--primary-500)] rounded-r-lg">
                    <h4 className="text-lg font-semibold text-[var(--primary-300)] mb-2">{patternFeedback.patternName}</h4>
                    <p className="text-gray-400 italic mb-4">"{patternFeedback.explanation}"</p>
                    <p className="font-semibold text-sm text-gray-300">Points for Reflection:</p>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 mt-2 text-sm">
                        {patternFeedback.reflectionPoints.map((point: string, i: number) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
            ));
        }
        if (isYpi(feedback)) {
            return (
                 <>
                    {[feedback.caregiver1Feedback, feedback.caregiver2Feedback].map((fb, index) => (
                        <div key={index} className="p-5 bg-gray-800/50 border-l-4 border-[var(--primary-500)] rounded-r-lg">
                             <h4 className="text-lg font-semibold text-[var(--primary-300)] mb-2">{fb.name} - Dominant Pattern: {fb.topCategory}</h4>
                             <p className="text-gray-400 italic mb-4">"{fb.explanation}"</p>
                             <p className="font-semibold text-sm text-gray-300">Points for Reflection:</p>
                             <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 mt-2 text-sm">
                                {fb.reflectionPoints.map((point: string, i: number) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                    <div className="p-5 bg-gray-700/50 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-200 mb-2">Comparison</h4>
                        <p className="text-[var(--text-secondary)] text-sm">{feedback.comparison}</p>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">AI-Powered Reflections</h2>
            <div className="space-y-6">
                {renderContent()}
            </div>
            <div className="mt-8 bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-md">
                <p className="font-bold text-yellow-300">Important Disclaimer:</p>
                <p className="text-sm">{feedback.disclaimer}</p>
            </div>
        </Card>
    );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ currentResult, allResults, onReset, caregiverNames, userName, currentTest, answers }) => {

  const allTestsCompleted = Object.keys(allResults).length === TESTS.length;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const handleDownloadReport = () => {
    const reportString = ReactDOMServer.renderToStaticMarkup(
      <FullReport allResults={allResults} userName={userName} />
    );

    const blob = new Blob([`<!DOCTYPE html>${reportString}`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_') || 'User';
    a.download = `MindfulPath_Report_${safeUserName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoadingChat) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput.trim()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoadingChat(true);

    try {
      const response = await getChatbotResponse(userInput.trim(), currentResult, allResults, currentTest, answers);
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const renderResults = () => {
      switch(currentResult.type) {
          case 'YSQ': return <YSQResultsDisplay results={currentResult} />;
          case 'YPI': return <YPIResultsDisplay results={currentResult} caregiverNames={caregiverNames} />;
          case 'SMI': return <SMIResultsDisplay results={currentResult} />;
          case 'OI': return <OIResultsDisplay results={currentResult} />;
          default: return <p>Could not display results.</p>;
      }
  }

  return (
    <div className="space-y-8">
      {renderResults()}

      {/* Psychoeducational Chatbot */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Ask Questions About Your Results</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Have questions about your schemas, modes, or results? Ask me anything!
        </p>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <p className="text-sm">Ask questions like:</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>"Why do I have high Abandonment?"</li>
                <li>"How do I work on Emotional Inhibition?"</li>
                <li>"What causes Punitive Parent mode?"</li>
                <li>"How are my schemas connected?"</li>
              </ul>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary-500)]/20 ml-8 border-l-4 border-[var(--primary-500)]'
                    : 'bg-gray-800/50 mr-8 border-l-4 border-gray-500'
                }`}
              >
                <p className="text-xs font-semibold mb-2 text-[var(--text-secondary)]">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))
          )}
          {isLoadingChat && (
            <div className="p-4 rounded-lg bg-gray-800/50 mr-8 border-l-4 border-gray-500">
              <p className="text-xs font-semibold mb-2 text-[var(--text-secondary)]">Assistant</p>
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your results..."
            className="flex-1 px-4 py-3 bg-gray-900/50 border border-[var(--border-color)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-sm"
            disabled={isLoadingChat}
          />
          <Button
            onClick={handleSendMessage}
            variant="primary"
            disabled={!userInput.trim() || isLoadingChat}
          >
            Send
          </Button>
        </div>
      </Card>

      <div className="text-center mt-8 space-x-4">
        {allTestsCompleted && (
            <Button onClick={handleDownloadReport} variant="primary">
                Download Full Report
            </Button>
        )}
        <Button onClick={onReset} variant="secondary">
          Take Another Assessment
        </Button>
      </div>
    </div>
  );
};

export default ResultsScreen;