const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'hug',
	slash: true,
	description: 'hugs someone',
	// guildOnly: '810474313245261824',
	expectedArgs: [
		{
			name: 'user',
			description: 'Select a user',
			type: 6
		},
		{
			name: 'reason',
			description: 'Enter roleplayable reason',
			type: 3
		}
	],
	run: async ({ client, guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);
		const links = ['https://waifu.pics/api/sfw/hug', 'https://nekos.life/api/v2/img/hug'];
		let str;

		if (args.user && args.user !== member.user.id) {
			const user = guild.members.cache.get(args.user);
			str = `**${member.user.username}** *hugs* ${user}${args.reason ? `, ${args.reason}` : ''}`;
		} else {
			return respond(`You're so lonely!`);
		}

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
