const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'uptime',
	slash: true,
	description: 'Checks the bot uptime!',
	// guildOnly: '810474313245261824',
	run: ({ client, respond }) => {
		const embed = new MessageEmbed()
			.setTitle(`:timer: Uptime`)
			.setColor(colors.default)
			.setDescription(`${ms(client.uptime, { long: true })}`);

		respond(embed);
	}
};
