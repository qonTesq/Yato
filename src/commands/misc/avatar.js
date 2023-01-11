const { MessageEmbed } = require('discord.js');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'avatar',
	slash: true,
	description: 'Displays a user\'s avatar!',
	// guildOnly: '810474313245261824',
	expectedArgs: '[user:6:Select the User]',
	run: async ({ guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed()
			.setColor(colors.default);

		if (Object.keys(args).length) {
			const user = guild.members.cache.get(args.user);
			const url = user.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' });
			embed.setImage(url);
			embed.setDescription(`Avatar of ${user}`);
		} else {
			const url = member.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' });
			embed.setImage(url);
			embed.setDescription(`Avatar of ${member}`);
		}

		respond(embed);
	}
};
