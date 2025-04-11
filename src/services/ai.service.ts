import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIModel, AIQueryRequest, AIQueryResponse } from "../types";
import { loadConfig } from "../config";

// Function to generate AI response (streaming method)
export async function generateAIResponse(request: AIQueryRequest): Promise<AIQueryResponse> {
    try {
        // Load configuration (to access token)
        const config = await loadConfig();
        
        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(config.gemini_api_token);
        
        // Model mapping
        let modelName: string;
        if (request.model === AIModel.GEMINI_25_PRO) {
            modelName = "gemini-1.5-pro";
        } else {
            modelName = "gemini-1.5-flash";
        }
        
        // Get generative model
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Calculate token count
        const { totalTokens } = await model.countTokens(request.prompt);
        console.log(`Prompt token count: ${totalTokens}`);
        
        // Generate response in streaming mode (separate processing - function returns response object immediately)
        return {
            model: request.model,
            prompt: request.prompt,
            response: "Generating response...",
            userId: request.userId,
            queryTimestamp: request.timestamp,
            responseTimestamp: new Date(),
            streamingModel: model, // Pass model object for streaming
            isStreaming: true, // Indicate streaming is in progress
            promptTokens: totalTokens // Store prompt token count
        };
    } catch (error) {
        console.error("Error generating AI response:", error);
        return {
            model: request.model,
            prompt: request.prompt,
            response: "An error occurred while generating the AI response.",
            userId: request.userId,
            queryTimestamp: request.timestamp,
            responseTimestamp: new Date(),
            isStreaming: false
        };
    }
} 