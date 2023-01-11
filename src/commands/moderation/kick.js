const { MessageEmbed } = require('discord.js');
const emojis = require('../../config/emojis.json');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'kick',
	slash: true,
	description: 'To kick a user from the server',
	// guildOnly: '810474313245261824',
	userRequiredPermissions: 'KICK_MEMBERS',
	clientRequiredPermissions: 'KICK_MEMBERS',
	minArgs: 1,
	expectedArgs: '<user:6:Select the User> [reason:3:Reason for kicking?]',
	run: async ({ client, guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const kickMember = guild.members.cache.get(args.user);
		const TickYes = client.emojis.cache.get(emojis.TickYes);
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (member.user.id === kickMember.user.id) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000You can't kick yourself!`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}
		if (!kickMember.kickable) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000I can't kick this member because of higher roles or the same roles as me or the bot doesn't have the permission to Kick Members!`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		let reason;
		if (args.reason) reason = `${args.reason} (${member.user.username})`;
		else reason = `No reason provided by ${member.user.username}`;

		await kickMember.kick(reason);
		embed.setColor(colors.green)
			.setDescription(`${TickYes}\u3000**${kickMember.user.tag}** has been kicked from the server!`);

		return respond(embed);
	}
};
