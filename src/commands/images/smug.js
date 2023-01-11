const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'smug',
	slash: true,
	description: 'SMUGGERED O.O',
	// guildOnly: '810474313245261824',
	run: async ({ client, member, respond }) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);
		const links = ['https://waifu.pics/api/sfw/smug', 'https://nekos.life/api/v2/img/smug'];
		const str = `**${member.user.username}** *smugs...*`;

		const image = await axios.get(links[Math.floor(Math.random() * links.length)]).then(res => res.data).catch(err => {
			console.log(err);
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000Something went wrong, please try again later or join our [Support Server](https://discord.gg/mm7Ke8T) to report this problem`);

			return embed;
		});

		if (!image.url) {
			return respond({
				content: image,
				ephemeral: true
			});
		}

		embed.setColor(colors.default)
			.setDescription(str)
			.setImage(image.url);

		return respond(embed);
	}
};
