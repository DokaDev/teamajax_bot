import { Client, Events, REST, Routes } from "discord.js";
import { SERVER_ID } from "../config";
import * as fs from "fs";
import * as path from "path";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client, token: string) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        // Load command files
        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] Command ${file} is missing data or execute property.`);
            }
        }

        // Register slash commands (only for specific server)
        try {
            const rest = new REST({ version: "10" }).setToken(token);
            console.log(`Registering slash commands for server ${SERVER_ID}...`);

            // Register commands only for specific server instead of globally
            await rest.put(
                Routes.applicationGuildCommands(client.user!.id, SERVER_ID),
                { body: commands }
            );

            console.log(`Successfully registered slash commands for server ${SERVER_ID}!`);
        } catch (error) {
            console.error("Error occurred while registering slash commands:", error);
        }
    },
}; 