import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Check bot information");

export async function execute(interaction: ChatInputCommandInteraction) {
    const serverCount = interaction.client.guilds.cache.size;
    const memberCount = interaction.client.guilds.cache.reduce(
        (acc, guild) => acc + (guild.memberCount || 0),
        0
    );

    await interaction.reply({
        embeds: [
            {
                title: "🤖 Bot Information",
                description: "Detailed information about this bot.",
                color: 0x3498db,
                fields: [
                    {
                        name: "Bot Name",
                        value: interaction.client.user?.username || "Unknown",
                        inline: true,
                    },
                    {
                        name: "Bot ID",
                        value: interaction.client.user?.id || "Unknown",
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: `${Math.round(
                            interaction.client.uptime ? interaction.client.uptime / 1000 : 0
                        )}s`,
                        inline: true,
                    },
                    {
                        name: "Server Count",
                        value: serverCount.toString(),
                        inline: true,
                    },
                    {
                        name: "Total Users",
                        value: memberCount.toString(),
                        inline: true,
                    },
                    {
                        name: "Created On",
                        value:
                            interaction.client.user?.createdAt.toLocaleDateString() ||
                            "Unknown",
                        inline: true,
                    },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: `Requested by: ${interaction.user.tag}`,
                },
            },
        ],
    });
} 