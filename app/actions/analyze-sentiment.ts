"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeSentiment(text: string) {
  try {
    // Use Gemini Flash for faster response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the prompt for sentiment analysis
    const prompt = `
      Analyze the sentiment of the following text and provide a structured JSON response.
      
      Text: "${text}"

      Respond only in pure JSON format without any markdown or explanations.
      {
        "positive": number,
        "negative": number,
        "neutral": number,
        "keywords": string[],
        "sources": string[],
        "summary": string,
        "sentiment_text": string,
        "emoji": string
      }

      The positive, negative, and neutral values should be percentages that add up to 100.
      The sentiment_text should be a short phrase describing the overall sentiment (e.g., "Very Positive", "Slightly Negative", etc.).
      The emoji should be a single emoji that best represents the sentiment.
    `;

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    // Ensure valid JSON by removing any Markdown formatting
    textResponse = textResponse.replace(/```json|```/g, "").trim();

    // Parse the JSON response safely
    const analysis = JSON.parse(textResponse);

    return {
      positive: analysis.positive || 0,
      negative: analysis.negative || 0,
      neutral: analysis.neutral || 0,
      keywords: analysis.keywords || [],
      sources: analysis.sources || [],
      summary: analysis.summary || "",
      sentiment_text: analysis.sentiment_text || getSentimentText(analysis.positive, analysis.negative),
      emoji: analysis.emoji || getSentimentEmoji(analysis.positive, analysis.negative)
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw new Error("Failed to analyze sentiment");
  }
}

// Fallback function to determine sentiment text if not provided by the API
function getSentimentText(positive: number, negative: number): string {
  if (positive >= 80) return "Very Positive";
  if (positive >= 60) return "Positive";
  if (positive >= 40 && negative <= 30) return "Slightly Positive";
  if (negative >= 80) return "Very Negative";
  if (negative >= 60) return "Negative";
  if (negative >= 40) return "Slightly Negative";
  return "Neutral";
}

// Fallback function to determine sentiment emoji if not provided by the API
function getSentimentEmoji(positive: number, negative: number): string {
  if (positive >= 80) return "😄";
  if (positive >= 60) return "🙂";
  if (positive >= 40 && negative <= 30) return "😊";
  if (negative >= 80) return "😡";
  if (negative >= 60) return "😠";
  if (negative >= 40) return "😕";
  return "😐";
}