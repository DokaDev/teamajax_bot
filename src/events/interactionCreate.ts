import { Collection, Events, Interaction } from "discord.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        // Load command
        const { commandName } = interaction;
        const client = interaction.client as any; // Type casting to access custom commands property
        const command = client.commands?.get(commandName);

        if (!command) {
            console.error(`Command ${commandName} not found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error occurred while executing command ${commandName}:`, error);
            
            // Check if already responded
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ 
                    content: 'An error occurred while executing the command.', 
                    ephemeral: true 
                });
            } else {
                await interaction.reply({ 
                    content: 'An error occurred while executing the command.', 
                    ephemeral: true 
                });
            }
        }
    },
}; 