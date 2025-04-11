import { Client, Collection, GatewayIntentBits } from "discord.js"; 
import { loadConfig } from "./config"; 
import * as fs from "fs"; 
import * as path from "path";

// Extend client type
declare module "discord.js" {
    export interface Client {
        commands: Collection<string, any>;
    }
}

// Asynchronous initialization function
async function init() {
    try {
        // Load configuration
        const config = await loadConfig();

        // Check bot token
        if (!config.token || config.token === "your_discord_bot_token_here") {
            console.error(
                "Discord bot token is not set. Please set the correct token in the config.yml file."
            );
            process.exit(1);
        }

        // Check Gemini API token
        if (!config.gemini_api_token || config.gemini_api_token === "your_gemini_api_token_here") {
            console.error(
                "Gemini API token is not set. Please set the correct token in the config.yml file."
            );
            process.exit(1);
        }

        // Create bot client instance (all intents enabled)
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
            ],
        });

        // Initialize commands collection
        client.commands = new Collection();

        // Load commands
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            // Validate and register command
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] Command ${file} is missing data or execute property.`);
            }
        }

        // Load event handlers
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath).default;
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, config.token));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }

        // Bot login
        await client.login(config.token);
    } catch (error) {
        console.error("Error during bot initialization:", error);
        process.exit(1);
    }
}

// Start application
init().catch(console.error);
