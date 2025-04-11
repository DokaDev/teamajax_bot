import { Events, Message } from "discord.js";

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // Ignore messages sent by bots
        if (message.author.bot) return;

        // Respond to mentions
        if (message.mentions.has(message.client.user?.id || "")) {
            await message.reply(
                "Did you call me? If you need help, try using the `/info` command!"
            );
        }
    },
}; 