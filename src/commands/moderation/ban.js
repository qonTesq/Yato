const { MessageEmbed } = require('discord.js');
const emojis = require('../../config/emojis.json');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'ban',
	slash: true,
	description: 'To ban a user from the server',
	// guildOnly: '810474313245261824',
	userRequiredPermissions: 'BAN_MEMBERS',
	clientRequiredPermissions: 'BAN_MEMBERS',
	minArgs: 1,
	expectedArgs: '<user:6:Select the User> [reason:3:Reason for banning?]',
	run: async ({ client, guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const banMember = guild.members.cache.get(args.user);
		const TickYes = client.emojis.cache.get(emojis.TickYes);
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (member.user.id === banMember.user.id) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000You can't ban yourself!`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}
		if (!banMember.kickable) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000I can't ban this member because of higher roles or the same roles as me or the bot doesn't have the permission to Ban Members!`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		let reason;
		if (args.reason) reason = `${args.reason} (${member.user.username})`;
		else reason = `No reason provided by ${member.user.username}`;

		await banMember.ban({ days: 0, reason: reason });
		embed.setColor(colors.green)
			.setDescription(`${TickYes}\u3000**${banMember.user.tag}** has been banned from the server!`);

		return respond(embed);
	}
};
