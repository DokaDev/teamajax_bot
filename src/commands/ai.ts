import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { AIModel, AIQueryRequest } from "../types";
import { generateAIResponse } from "../services/ai.service";
import { normalizeNewlines } from "../utils/textFormatter";

export const data = new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Ask AI a question and get a response")
    .addStringOption((option) =>
        option
            .setName("model")
            .setDescription("AI model to use")
            .setRequired(true)
            .addChoices(
                { name: "Gemini 2.5 Pro Preview 03-25", value: AIModel.GEMINI_25_PRO },
                { name: "Gemini 2.0 Flash", value: AIModel.GEMINI_20_FLASH }
            ))
    .addStringOption((option) =>
        option
            .setName("question")
            .setDescription("Question to ask the AI")
            .setRequired(true)
    );

// Function to split messages into multiple parts (Discord message limit is 2000 characters)
function splitMessage(text: string, maxLength: number = 1900): string[] {
    const messages: string[] = [];
    let currentMessage = "";
    
    // Split by line breaks
    const lines = text.split('\n');
    
    for (const line of lines) {
        // Check if adding the current line would exceed the maximum length
        if (currentMessage.length + line.length + 1 > maxLength) {
            messages.push(currentMessage);
            currentMessage = line;
        } else {
            if (currentMessage.length > 0) {
                currentMessage += '\n';
            }
            currentMessage += line;
        }
    }
    
    // Add the last message
    if (currentMessage.length > 0) {
        messages.push(currentMessage);
    }
    
    return messages;
}

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply(); // Show "thinking" status (to avoid 3-second timeout)
        
        const model = interaction.options.getString("model", true) as AIModel;
        const prompt = interaction.options.getString("question", true);
        
        const request: AIQueryRequest = {
            model,
            prompt,
            userId: interaction.user.id,
            timestamp: new Date()
        };
        
        const aiResponse = await generateAIResponse(request);
        
        // Use plain text for initial response message
        await interaction.editReply(`**User Question**: ${prompt}\n\n**Response**: Generating response...`);
        
        // Streaming handling
        if (aiResponse.isStreaming && aiResponse.streamingModel) {
            try {
                // Start streaming
                const result = await aiResponse.streamingModel.generateContentStream(prompt);
                
                let text = '';
                let lastUpdateTime = Date.now();
                const UPDATE_INTERVAL = 2000; // Update every 2 seconds (considering Discord API rate limits)
                
                // Receive response chunks from the stream
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    text += chunkText;
                    
                    // Only update message after a certain time has passed since the last update
                    const currentTime = Date.now();
                    if (currentTime - lastUpdateTime > UPDATE_INTERVAL) {
                        // Apply newline normalization
                        const normalizedText = normalizeNewlines(text);
                        
                        // Apply length limit (use splitMessage for intermediate updates too)
                        const messageParts = splitMessage(`**User Question**: ${prompt}\n**Response**: ${normalizedText}`);
                        
                        // Only update the first part (only modify the first message during intermediate updates)
                        await interaction.editReply(messageParts[0]);
                        lastUpdateTime = currentTime;
                    }
                }
                
                // Final response update
                const finalText = normalizeNewlines(text);
                
                // Split response into multiple messages if too long
                const messages = splitMessage(finalText);
                
                // First message includes the question
                if (messages.length > 0) {
                    await interaction.editReply(`**User Question**: ${prompt}\n\n**Response**: ${messages[0]}`);
                }
                
                // Send remaining messages as follow-ups (only if there are multiple messages)
                for (let i = 1; i < messages.length; i++) {
                    await interaction.followUp(messages[i]);
                }
                
                // Calculate response tokens
                const { totalTokens: responseTokens } = await aiResponse.streamingModel.countTokens(finalText);
                const totalTokens = (aiResponse.promptTokens || 0) + responseTokens;
                
                // Display token information in an embed (added at the end)
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Response Information")
                    .setFields(
                        { name: "Model", value: model === AIModel.GEMINI_25_PRO ? "Gemini 2.5 Pro" : "Gemini 2.0 Flash", inline: true },
                        { name: "Prompt Tokens", value: aiResponse.promptTokens?.toString() || "N/A", inline: true },
                        { name: "Response Tokens", value: responseTokens.toString(), inline: true },
                        { name: "Total Tokens", value: totalTokens.toString(), inline: true }
                    )
                    .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                    .setTimestamp();
                
                await interaction.followUp({ embeds: [embed] });
                
            } catch (error) {
                console.error("Error during streaming process:", error);
                await interaction.editReply(`**User Question**: ${prompt}\n\n**Response**: An error occurred while generating the response.`);
            }
        } else {
            // Non-streaming case (e.g., error occurred)
            await interaction.editReply(`**User Question**: ${prompt}\n\n**Response**: ${aiResponse.response}`);
        }
    } catch (error) {
        console.error("Error processing AI command:", error);
        await interaction.followUp({ content: "An error occurred while processing the command.", ephemeral: true });
    }
} 