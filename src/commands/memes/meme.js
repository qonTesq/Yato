const { MessageEmbed } = require('discord.js');
const { redditFetcher } = require('../../structures/utils');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'meme',
	slash: true,
	description: 'Quality memes from several subreddits',
	// guildOnly: '810474313245261824',
	cooldown: 10,
	run: async ({ client, channel, respond, edit }) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);
		const subs = ['memes', 'AdviceAnimals', 'dankmemes'];
		const randomSub = subs[Math.floor(Math.random() * subs.length)];

		respond({
			content: 'getting spicy memes...',
			thinking: true
		});
		const data = await redditFetcher(randomSub, channel);

		if (!data) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000An unknown error occured, if the error still persists after some time then report in Yato's [Support Server](https://discord.gg/mm7Ke8T)`);
			return edit({
				content: embed,
				ephemeral: true
			});
		}

		embed.setColor(colors.default)
			.setTitle(data.title)
			.setDescription(`Posted by **[u/${data.author}](https://www.reddit.com/user/${data.author}/)**`)
			.setImage(data.image)
			.setURL(data.postLink)
			.setFooter(`👍 ${data.ups}\u3000•\u3000${data.subredditNamePrefixed}`);

		return edit({
			content: embed
		});
	}
};
