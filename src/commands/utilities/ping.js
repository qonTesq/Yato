const { MessageEmbed } = require('discord.js');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'ping',
	slash: true,
	description: 'Checks the bot ping!',
	// guildOnly: '810474313245261824',
	run: ({ client, respond }) => {
		const choices = ['Is this really my ping?', 'Is this okay? i can\'t look!', 'I hope it isn\'t bad!'];
		const response = choices[Math.floor(Math.random() * choices.length)];

		const embed = new MessageEmbed()
			.setTitle(`:ping_pong: ${response}`)
			.setColor(colors.default)
			.addField('API Latency', `**${Math.round(client.ws.ping)}ms**`);

		respond(embed);
	}
};
