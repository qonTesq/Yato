const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('gcommands');
const utils = require('../../structures/utils');
const emojis = require('../../config/emojis.json');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'manga',
	slash: true,
	description: 'Gives detailed information about a manga from AniList.',
	// guildOnly: '810474313245261824',
	cooldown: 20,
	expectedArgs: [
		{
			name: 'search',
			description: 'Enter manga title',
			type: 3,
			required: true
		}
	],
	run: async ({ client, member, channel, respond, edit }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		respond({
			content: 'loading...',
			thinking: true
		});
		const res = await utils.animeMangaSearch('manga', args.search, channel);
		if (!res) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000Nothing found on "**${args.search}**"`);
			edit({
				content: embed
			});
		} else {
			const nextPage = new MessageButton()
				.setStyle('gray')
				.setLabel('Next')
				.setID('next')
				.toJSON();
			const previousPage = new MessageButton()
				.setStyle('gray')
				.setLabel('Back')
				.setID('previous')
				.toJSON();

			const buttonRow = new MessageActionRow()
				.addComponent(previousPage)
				.addComponent(nextPage);

			const msg = await edit({
				content: res[0],
				components: buttonRow
			});

			const filter = (button) => button.clicker.user.id === member.user.id;
			const collector = msg.createButtonCollector(filter, { time: 60000, errors: ['time'] });

			let page = 0;
			collector.on('collect', (button) => {
				const { id } = button;
				if (id === 'previous') {
					page = page > 0 ? --page : res.length - 1;
				} else {
					page = page + 1 < res.length ? ++page : 0;
				}
				button.edit({
					content: res[page],
					components: buttonRow
				});
			});

			collector.on('end', () => {
				edit({
					content: res[page]
				});
			});
		}
	}
};
