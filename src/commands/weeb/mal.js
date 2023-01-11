/* eslint-disable prefer-destructuring */
const { MessageEmbed } = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
const emojis = require('../../config/emojis.json');
const colors = require('../../config/colors.json');
const UserModel = require('../../models/user');

const getProfile = async (username) => {
	const profile = await mal.findUser(username).catch(err => {
		const errorObj = {
			error: {
				response: null,
				message: ''
			}
		};
		err = err.split(' ');
		if (err[1] === '503') {
			errorObj.error.response = '503';
			errorObj.error.message = 'Something is not working on MyAnimeList’s end. MyAnimeList is either down/unavailable or is refusing to connect';
		} else if (err[1] === '500') {
			errorObj.error.response = '500';
			errorObj.error.message = 'Something is not working on our end. If the error still persists after some time then report in Yato\'s [Support Server](https://discord.gg/mm7Ke8T)';
		} else if (err[1] === '404') {
			errorObj.error.response = '404';
			errorObj.error.message = 'The provided username is incorrect.';
		} else {
			console.log(err);
			errorObj.error.response = err[1];
			errorObj.error.message = 'An unknown error occured, if the error still persists after some time then report in Yato\'s [Support Server](https://discord.gg/mm7Ke8T)';
		}

		return errorObj;
	});
	return profile;
};

module.exports = {
	name: 'mal',
	slash: true,
	description: 'Retrieves yours or the specified user\'s MyAnimeList stats.',
	// guildOnly: '810474313245261824',
	minArgs: 1,
	cooldown: 10,
	expectedArgs: [
		{
			name: 'user',
			description: 'Select a user.',
			type: 6
		},
		{
			name: 'username',
			description: 'Enter MyAnimeList username.',
			type: 3
		}
	],
	run: async ({ client, guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (args.user && args.username) {
			embed.setColor(colors.default)
				.setTitle('**Command Usage**')
				.setDescription('Type `/mal user:` and select a user from the menu\n\n(**OR**)\n\nType `/mal username:<myanimelist username>`')
				.setFooter('To know your own stats simply write /mal');
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		let name;
		let malUsername;

		if (args.username) {
			name = args.username;
			malUsername = args.username;
		} else if (args.user) {
			const user = guild.members.cache.get(args.user);
			const userRes = await UserModel.findOne({ id: user.id });
			if (!userRes || !userRes.aniProfile.mal) {
				embed.setColor(colors.red)
					.setDescription(`${TickNo}\u3000The user has not linked their account with Yato`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}
			malUsername = userRes.aniProfile.mal;
			name = user.user.username;
		} else {
			const userRes = await UserModel.findOne({ id: member.user.id });
			if (!userRes || !userRes.aniProfile.mal) {
				embed.setColor(colors.red)
					.setDescription(`${TickNo}\u3000You have not linked your account with Yato\nUse \`set\` command to link your account`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}
			malUsername = userRes.aniProfile.mal;
			name = member.user.username;
		}

		const profile = await getProfile(malUsername);

		if (profile.error) {
			embed.setColor(colors.red)
				.setTitle(`${TickNo} Error fetching the MyAnimeList Account!`)
				.setDescription(`${profile.error.message}`);

			return respond({
				content: embed,
				ephemeral: true
			});
		}

		embed.setTitle(`${name}'s MyAnimeList Statistics`)
			.setColor(colors.mal)
			.setTimestamp()
			.setFooter(profile.username)
			.setURL(profile.url)
			.addField('🖥️  Anime Stats', [
				`• Episodes: **${profile.anime_stats.episodes_watched}**`,
				`• Days: **${profile.anime_stats.days_watched}**`,
				`• Mean Score: **${profile.anime_stats.mean_score}**`,
				`• Watching: **${profile.anime_stats.watching}**`,
				`• Planned: **${profile.anime_stats.plan_to_watch}**`,
				`• On Hold: **${profile.anime_stats.on_hold}**`,
				`• Dropped: **${profile.anime_stats.dropped}**`,
				`• Completed: **${profile.anime_stats.completed}**`,
				`\u3000 Total: **${profile.anime_stats.total_entries}**`,
				`\u200b`
			], true)
			.addField('📚  Manga Stats', [
				`• Chapters: **${profile.manga_stats.chapters_read}**`,
				`• Days: **${profile.manga_stats.days_read}**`,
				`• Mean Score: **${profile.manga_stats.mean_score}**`,
				`• Reading: **${profile.manga_stats.reading}**`,
				`• Planned: **${profile.manga_stats.plan_to_read}**`,
				`• On Hold: **${profile.manga_stats.on_hold}**`,
				`• Dropped: **${profile.manga_stats.dropped}**`,
				`• Completed: **${profile.manga_stats.completed}**`,
				`\u3000 Total: **${profile.manga_stats.total_entries}**`,
				`\u200b`
			], true);
		if (profile.favorites) {
			const value = [];
			if (profile.favorites.characters[0]) value.push(`• Character: **[${profile.favorites.characters[0].name}](${profile.favorites.characters[0].url})**`);
			if (profile.favorites.anime[0]) value.push(`• Anime: **[${profile.favorites.anime[0].name}](${profile.favorites.anime[0].url})**`);
			if (profile.favorites.manga[0]) value.push(`• Manga: **[${profile.favorites.manga[0].name}](${profile.favorites.manga[0].url})**`);

			if (value.length) embed.addField('⭐  Favourites', value);
		}
		if (profile.image_url) embed.setThumbnail(profile.image_url);

		return respond(embed);
	}
};
