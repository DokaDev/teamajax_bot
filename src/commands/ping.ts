import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Simple ping command");

export async function execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
        content: "Pinging...",
        fetchReply: true,
    });
    const pingTime = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(
        `Pong! Latency: ${pingTime}ms, API Latency: ${Math.round(
            interaction.client.ws.ping
        )}ms`
    );
} 