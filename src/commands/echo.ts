import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Sends back the text you entered")
    .addStringOption((option) =>
        option
            .setName("text")
            .setDescription("Text to send back")
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString("text");
    if (!text)
        return interaction.reply({
            content: "Please enter text.",
            ephemeral: true,
        });
    await interaction.reply(text);
} 