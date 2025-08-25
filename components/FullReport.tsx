import React from 'react';
import { TestResult, TestType, YSCTestResult, YPITestResult, OITestResult, SMITestResult, YPICategory, Question } from '../types';
import { SCHEMA_DEFINITIONS, YPI_CATEGORY_DEFINITIONS, SMI_MODE_DEFINITIONS, OI_CATEGORY_DEFINITIONS, YPI_QUESTION_TO_CATEGORY_MAP } from '../constants';

interface FullReportProps {
  allResults: Partial<Record<TestType, TestResult>>;
  userName: string;
}

const ReportScoreBar: React.FC<{ label: string; score: number; maxScore: number }> = ({ label, score, maxScore }) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    let color = '#4ade80'; // green-400
    if (score / maxScore >= 0.8) {
        color = '#f87171'; // red-400
    } else if (score / maxScore >= 0.6) {
        color = '#fb923c'; // orange-400
    } else if (score / maxScore >= 0.4) {
        color = '#facc15'; // yellow-400
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 40px', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
            <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: color, borderRadius: '9999px' }}></div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right' }}>{score.toFixed(1)}</div>
        </div>
    );
};

const GeminiFeedbackCard: React.FC<{ title: string; explanation: string; reflectionPoints: string[] }> = ({ title, explanation, reflectionPoints }) => (
    <div style={{ borderLeft: '4px solid #6366f1', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0 4px 4px 0', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#3730a3' }}>{title}</h4>
        <p style={{ fontStyle: 'italic', color: '#4b5563', margin: '0.5rem 0' }}>"{explanation}"</p>
        <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '14px' }}>Points for Reflection:</p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyleType: 'disc', color: '#4b5563', fontSize: '14px' }}>
            {reflectionPoints.map((point, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{point}</li>)}
        </ul>
    </div>
);

export const FullReport: React.FC<FullReportProps> = ({ allResults, userName }) => {
    const ysqResults = allResults.YSQ as YSCTestResult | undefined;
    const ypiResults = allResults.YPI as YPITestResult | undefined;
    const smiResults = allResults.SMI as SMITestResult | undefined;
    const oiResults = allResults.OI as OITestResult | undefined;

    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Mindful Path - Comprehensive Report for {userName || 'User'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
                    body { font-family: 'Lexend', sans-serif; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none; }
                        .page-break { page-break-before: always; }
                    }
                `}
            </style>
        </head>
        <body className="bg-gray-100 text-gray-800">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 my-8 shadow-2xl rounded-lg">

                <header className="text-center border-b-2 border-gray-200 pb-6 mb-8">
                    <h1 className="text-4xl font-bold text-indigo-800">Mindful Path</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mt-2">Comprehensive Self-Discovery Report</h2>
                    {userName && <p className="text-xl text-gray-600 mt-2">Prepared for: {userName}</p>}
                </header>

                <main className="space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Introduction</h3>
                        <p className="text-gray-600">This report summarizes the results from your self-assessments. It is designed to be a tool for self-reflection and to help you identify potential life patterns, emotional needs, and coping styles based on the principles of Schema Therapy. Use these insights as a starting point for deeper self-exploration, journaling, or discussions with a mental health professional.</p>
                    </section>

                    {/* YSQ Results Section */}
                    {ysqResults && (
                        <section className="page-break">
                            <h3 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Schema Quiz (YSQ)</h3>
                            <div className="p-6 bg-gray-50 rounded-lg space-y-3 mb-6">
                                {ysqResults.scores.map(s => <ReportScoreBar key={s.schema} label={s.schema} score={s.score} maxScore={6} />)}
                            </div>
                            {ysqResults.feedback && (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Reflections</h4>
                                    {ysqResults.feedback.topSchemas.map(f => <GeminiFeedbackCard key={f.schemaName} title={f.schemaName} explanation={f.explanation} reflectionPoints={f.reflectionPoints} />)}
                                </>
                            )}
                        </section>
                    )}

                    {/* SMI Results Section */}
                    {smiResults && (
                        <section className="page-break">
                             <h3 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Schema Mode Inventory (SMI)</h3>
                            <div className="p-6 bg-gray-50 rounded-lg space-y-3 mb-6">
                                {smiResults.scores.sort((a,b) => b.score - a.score).map(s => <ReportScoreBar key={s.mode} label={s.mode} score={s.score} maxScore={6} />)}
                            </div>
                             {smiResults.feedback && (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Reflections</h4>
                                    {smiResults.feedback.topModes.map(f => <GeminiFeedbackCard key={f.modeName} title={f.modeName} explanation={f.explanation} reflectionPoints={f.reflectionPoints} />)}
                                    <div style={{ borderLeft: '4px solid #22c55e', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0 4px 4px 0', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#15803d' }}>Healthy Adult Mode (Score: {smiResults.feedback.healthyAdult.score.toFixed(1)})</h4>
                                        <p style={{ color: '#16a34a', margin: '0.5rem 0', fontSize: '14px' }}>{smiResults.feedback.healthyAdult.commentary}</p>
                                    </div>
                                </>
                            )}
                        </section>
                    )}

                    {/* OI Results Section */}
                    {oiResults && (
                        <section className="page-break">
                             <h3 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Overcompensation Inventory (OI)</h3>
                            <div className="p-6 bg-gray-50 rounded-lg space-y-3 mb-6">
                                {oiResults.scores.sort((a,b) => b.score - a.score).map(s => <ReportScoreBar key={s.category} label={s.category} score={s.score} maxScore={6} />)}
                            </div>
                             {oiResults.feedback && (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Reflections</h4>
                                    {oiResults.feedback.topPatterns.map(f => <GeminiFeedbackCard key={f.patternName} title={f.patternName} explanation={f.explanation} reflectionPoints={f.reflectionPoints} />)}
                                </>
                            )}
                        </section>
                    )}

                    {/* YPI Results Section */}
                    {ypiResults && (
                        <section className="page-break">
                            <h3 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Parenting Inventory (YPI)</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {Object.entries(ypiResults.scores).map(([key, value]) => {
                                    const caregiverName = key === 'caregiver1' 
                                        ? ypiResults.feedback?.caregiver1Feedback.name ?? 'Caregiver 1' 
                                        : ypiResults.feedback?.caregiver2Feedback.name ?? 'Caregiver 2';
                                    const hasPatterns = Object.values(value as Record<YPICategory, Question[]>).some((arr) => arr.length > 0);
                                    return (
                                        <div key={key} className="p-6 bg-gray-50 rounded-lg">
                                            <h4 className="text-xl font-bold text-center mb-4 text-gray-800">{caregiverName}</h4>
                                             {hasPatterns ? Object.entries(value).map(([cat, questions]) => {
                                                if ((questions as Question[]).length === 0) return null;
                                                const maxScore = Object.values(YPI_QUESTION_TO_CATEGORY_MAP).filter(c => c === cat).length;
                                                return <ReportScoreBar key={cat} label={cat} score={(questions as Question[]).length} maxScore={maxScore} />
                                             }) : <p className="text-gray-500 text-center">No prominent negative patterns identified.</p>}
                                        </div>
                                    )
                                })}
                            </div>
                             {ypiResults.feedback && (
                                <div className="mt-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Reflections</h4>
                                    <GeminiFeedbackCard title={`${ypiResults.feedback.caregiver1Feedback.name} - ${ypiResults.feedback.caregiver1Feedback.topCategory}`} explanation={ypiResults.feedback.caregiver1Feedback.explanation} reflectionPoints={ypiResults.feedback.caregiver1Feedback.reflectionPoints} />
                                    <GeminiFeedbackCard title={`${ypiResults.feedback.caregiver2Feedback.name} - ${ypiResults.feedback.caregiver2Feedback.topCategory}`} explanation={ypiResults.feedback.caregiver2Feedback.explanation} reflectionPoints={ypiResults.feedback.caregiver2Feedback.reflectionPoints} />
                                </div>
                            )}
                        </section>
                    )}
                    
                    {/* Disclaimer */}
                    <footer className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
                        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                            <p className="font-bold">Important Disclaimer</p>
                            <p className="text-sm">This report is an educational tool based on your self-reported answers and AI-generated insights. It is not a clinical diagnosis. The information provided should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                        </div>
                        <p className="mt-6 text-sm text-gray-500">&copy; 2024 Mindful Path. All rights reserved.</p>
                    </footer>
                </main>
            </div>
             <button
                onClick={() => window.print()}
                className="no-print fixed bottom-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
            >
                Print or Save as PDF
            </button>
        </body>
        </html>
    );
};