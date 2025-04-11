import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Check current server information");

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild)
        return interaction.reply(
            "This command can only be used in a server."
        );

    const iconUrl = guild.iconURL();

    await interaction.reply({
        embeds: [
            {
                title: `📊 ${guild.name} Server Information`,
                color: 0x2ecc71,
                thumbnail: iconUrl
                    ? {
                            url: iconUrl,
                        }
                    : undefined,
                fields: [
                    { name: "Server ID", value: guild.id, inline: true },
                    {
                        name: "Owner",
                        value: `<@${guild.ownerId}>`,
                        inline: true,
                    },
                    {
                        name: "Created On",
                        value: guild.createdAt.toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: "Member Count",
                        value: guild.memberCount.toString(),
                        inline: true,
                    },
                    {
                        name: "Channel Count",
                        value: guild.channels.cache.size.toString(),
                        inline: true,
                    },
                    {
                        name: "Role Count",
                        value: guild.roles.cache.size.toString(),
                        inline: true,
                    },
                    {
                        name: "Boost Level",
                        value: guild.premiumTier.toString(),
                        inline: true,
                    },
                    {
                        name: "Boost Count",
                        value: (
                            guild.premiumSubscriptionCount || 0
                        ).toString(),
                        inline: true,
                    },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    });
} 