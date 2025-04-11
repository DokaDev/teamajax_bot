import { Events, GuildMember } from "discord.js";

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const channel = member.guild.systemChannel;
        if (channel) {
            await channel.send(
                `Welcome to the ${member.guild.name} server, ${member.user.tag}! 🎉`
            );
        }
    },
}; 