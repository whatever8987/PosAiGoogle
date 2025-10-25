import { GoogleGenAI, Type } from '@google/genai';
import { NAIL_SALON_SCHEMA } from '../constants';
import type { QueryResult } from '../types';

// Mock data generation for charts
const generateMockData = (sql: string): Record<string, any>[] => {
  const lowerSql = sql.toLowerCase();
  if (lowerSql.includes('group by') && (lowerSql.includes('sum(') || lowerSql.includes('count('))) {
    // Categorical data
    const categories = ['Manicure', 'Pedicure', 'Gel Polish', 'Acrylics', 'Nail Art'];
    const metric = sql.match(/sum\((.*?)\)/i)?.[1] || sql.match(/count\((.*?)\)/i)?.[1] || 'value';
    const nameKey = sql.match(/select (.*?),/i)?.[1].split('.').pop()?.trim() || 'name';
    return categories.map(cat => ({
      [nameKey]: cat,
      [metric]: Math.floor(Math.random() * 5000) + 1000
    }));
  }
  if (lowerSql.includes('group by date') || lowerSql.includes('group by month')) {
    // Time series data
    const metric = sql.match(/sum\((.*?)\)/i)?.[1] || 'value';
    const dateKey = 'date';
    return Array.from({ length: 10 }, (_, i) => ({
      [dateKey]: `2023-10-${i + 1}`,
      [metric]: Math.floor(Math.random() * 2000) + 500
    }));
  }
   // Default generic data
  return [
    { name: 'Category A', value: Math.floor(Math.random() * 1000) },
    { name: 'Category B', value: Math.floor(Math.random() * 1000) },
    { name: 'Category C', value: Math.floor(Math.random() * 1000) },
    { name: 'Category D', value: Math.floor(Math.random() * 1000) },
  ];
};


export const generateSqlAndChart = async (question: string): Promise<QueryResult | { error: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Based on the following PostgreSQL schema for a nail salon business, generate a single, executable SQL query to answer the user's question.
        Also, suggest the best chart type ('bar', 'line', or 'pie') to visualize the result, provide a brief, friendly explanation of what the query does,
        and provide an array of 3 brief, relevant follow-up questions a user might ask next.

        SCHEMA:
        ${NAIL_SALON_SCHEMA}

        USER QUESTION:
        "${question}"

        Your response MUST be a valid JSON object with the following structure:
        {
          "sql": "SELECT ...",
          "chartType": "bar" | "line" | "pie",
          "explanation": "This query...",
          "followUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
        }
        Do not include any text, backticks, or formatting outside of the JSON object.
      `,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.OBJECT,
            properties: {
              sql: { type: Type.STRING },
              chartType: { type: Type.STRING },
              explanation: { type: Type.STRING },
              followUps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
              }
            },
            required: ["sql", "chartType", "explanation", "followUps"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (typeof result.sql !== 'string' || !['bar', 'line', 'pie'].includes(result.chartType) || typeof result.explanation !== 'string' || !Array.isArray(result.followUps)) {
        throw new Error("Received an invalid JSON structure from the API.");
    }

    const mockData = generateMockData(result.sql);

    return { ...result, data: mockData };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred while contacting the AI model.";
    return { error: message };
  }
};