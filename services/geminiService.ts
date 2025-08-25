import { GoogleGenAI, Type } from '@google/genai';
import { SchemaScore, YPICategoryScores, GeminiFeedback, GeminiParentingFeedback, SchemaModeScore, GeminiSMIFeedback, OIScore, GeminiOIFeedback } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const safeParseJson = <T>(jsonString: string, fallback: T): T => {
    try {
        if (!jsonString) return fallback;
        const cleanedJsonString = jsonString.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedJsonString) as T;
    } catch (e) {
        console.error("JSON parsing error:", e);
        return fallback;
    }
};

export const getYSQFeedback = async (scores: SchemaScore[]): Promise<GeminiFeedback | null> => {
    const significantSchemas = scores.filter(s => s.score >= 4);
    if (significantSchemas.length === 0) return null;

    const topSchemas = significantSchemas.sort((a, b) => b.score - a.score).slice(0, 3);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following schema scores: ${JSON.stringify(topSchemas)}. Provide an explanation and 2-3 reflection points for each.`,
        config: {
            systemInstruction: `You are a helpful assistant trained in Schema Therapy principles. Your role is to provide supportive and insightful feedback based on quiz results. You are not a therapist. Always provide a disclaimer that this is not a diagnosis. Focus on the top 3 schemas provided. For each schema, provide a brief, gentle explanation of how it might manifest in daily life and 2-3 concise, actionable reflection points as a list.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topSchemas: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                schemaName: { type: Type.STRING },
                                score: { type: Type.NUMBER },
                                explanation: { type: Type.STRING },
                                reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                        },
                    },
                    disclaimer: { type: Type.STRING },
                },
            },
        },
    });

    return safeParseJson(response.text, null);
};

export const getParentingFeedback = async (scores: YPICategoryScores, names: { c1: string, c2: string }): Promise<GeminiParentingFeedback | null> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze these parenting inventory results for two caregivers, ${names.c1} and ${names.c2}. Results: ${JSON.stringify(scores)}. Identify the top category for each, explain it, provide reflection points, and compare the two caregivers.`,
        config: {
            systemInstruction: `You are an assistant with knowledge of parenting styles and their potential impact on development, based on Schema Therapy. You are not a therapist. Analyze the provided data, which shows categories where a user rated a caregiver 4 or higher. For each caregiver, identify the category with the most high scores as their 'topCategory'. Provide a gentle explanation and 2-3 reflection points. Then, provide a brief 'comparison' of the two parenting styles. Always include a disclaimer.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    caregiver1Feedback: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING }, topCategory: { type: Type.STRING }, explanation: { type: Type.STRING }, reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    },
                    caregiver2Feedback: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING }, topCategory: { type: Type.STRING }, explanation: { type: Type.STRING }, reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    },
                    comparison: { type: Type.STRING },
                    disclaimer: { type: Type.STRING },
                }
            }
        }
    });

    return safeParseJson(response.text, null);
};

export const getSMIFeedback = async (scores: SchemaModeScore[]): Promise<GeminiSMIFeedback | null> => {
    const significantModes = scores.filter(s => s.score >= 4.0 && s.mode !== 'Healthy Adult').sort((a,b)=> b.score - a.score).slice(0, 3);
    const healthyAdultScore = scores.find(s => s.mode === 'Healthy Adult');
    if (significantModes.length === 0 && (!healthyAdultScore || healthyAdultScore.score < 4.0)) return null;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze these schema mode scores. Top maladaptive modes: ${JSON.stringify(significantModes)}. Healthy Adult score: ${JSON.stringify(healthyAdultScore)}. Provide explanations, reflection points, commentary on the Healthy Adult score, and how the modes might interact.`,
        config: {
            systemInstruction: `You are an assistant trained in Schema Therapy concepts, specifically Schema Modes. Your task is to provide feedback on a user's Schema Mode Inventory results. For each of the top 3 maladaptive modes, provide a gentle explanation and 2-3 reflection points. Provide specific commentary on the Healthy Adult score, noting its strength or areas for growth. Provide a paragraph on how the identified modes might interact. Always include a disclaimer that this is not a diagnosis.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topModes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { modeName: {type: Type.STRING}, score: {type: Type.NUMBER}, explanation: {type: Type.STRING}, reflectionPoints: {type: Type.ARRAY, items: {type: Type.STRING}}} } },
                    healthyAdult: { type: Type.OBJECT, properties: { score: {type: Type.NUMBER}, commentary: {type: Type.STRING} } },
                    interaction: { type: Type.STRING },
                    disclaimer: { type: Type.STRING }
                }
            }
        }
    });

    return safeParseJson(response.text, null);
};

export const getOIFeedback = async (scores: OIScore[]): Promise<GeminiOIFeedback | null> => {
    const significantPatterns = scores.filter(s => s.score >= 4.0).sort((a,b)=> b.score - a.score).slice(0, 3);
    if (significantPatterns.length === 0) return null;

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze these overcompensation inventory scores: ${JSON.stringify(significantPatterns)}. Provide an explanation and 2-3 reflection points for each significant pattern.`,
        config: {
            systemInstruction: `You are an assistant trained in Schema Therapy concepts, focusing on overcompensatory coping styles. Your role is to provide supportive feedback on a user's inventory results. You are not a therapist. For each of the top 3 patterns provided, provide a brief, gentle explanation of the pattern and what underlying schema it might be defending against. Then, provide 2-3 concise, actionable reflection points. Always include a disclaimer that this is not a diagnosis.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topPatterns: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                patternName: { type: Type.STRING },
                                score: { type: Type.NUMBER },
                                explanation: { type: Type.STRING },
                                reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                        },
                    },
                    disclaimer: { type: Type.STRING },
                },
            },
        },
    });

    return safeParseJson(response.text, null);
};
