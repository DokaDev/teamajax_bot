// Configuration file type definition
export interface Config {
    token: string;
    gemini_api_token: string;
}

// AI model type definition
export enum AIModel {
    GEMINI_25_PRO = "Gemini 2.5 Pro Preview 03-25",
    GEMINI_20_FLASH = "Gemini 2.0 Flash"
}

// AI query request type
export interface AIQueryRequest {
    model: AIModel;
    prompt: string;
    userId: string;
    timestamp: Date;
}

// AI query response type
export interface AIQueryResponse {
    model: AIModel;
    prompt: string;
    response: string;
    userId: string;
    queryTimestamp: Date;
    responseTimestamp: Date;
    isStreaming?: boolean;
    streamingModel?: any; // Model object for streaming
    promptTokens?: number; // Number of prompt tokens
    responseTokens?: number; // Number of response tokens
    totalTokens?: number; // Total number of tokens
} 