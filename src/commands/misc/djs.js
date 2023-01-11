const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('gcommands');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'djs',
	slash: true,
	description: 'Shows detailed information from discord.js documentation',
	// guildOnly: '810474313245261824',
	expectedArgs: [
		{
			name: 'search',
			description: 'Enter search query',
			type: 3,
			required: true
		}
	],
	run: async ({ client, member, respond, edit }, arrayArgs, args) => {
		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.search)}`;

		const docFetch = await axios.get(url);
		const embed = docFetch.data;

		if (!embed || embed.error) {
			const TickNo = client.emojis.cache.get(emojis.TickNo);
			const errEmbed = new MessageEmbed()
				.setColor(colors.red)
				.setDescription(`${TickNo}\u3000"${args.search}" coundn't find within the discord.js documentation (<https://discord.js.org/>).`);
			respond({
				content: errEmbed,
				ephemeral: true
			});
			return;
		}

		const binButton = new MessageButton()
			.setStyle('red')
			.setID('bin')
			.setLabel('Delete')
			.toJSON();
		const row = new MessageActionRow()
			.addComponent(binButton);

		const msg = await respond({
			content: embed,
			components: row
		});
		let collector;
		try {
			const filter = (button) => button.clicker.user.id === member.user.id;
			collector = await msg.awaitButtons(filter, { max: 1, time: 10000, errors: ['time'] });
		} catch (err) {
			edit({
				content: embed
			});
		}

		if (collector && collector.first()) msg.delete();
	}
};
