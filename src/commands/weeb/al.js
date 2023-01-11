/* eslint-disable new-cap */
const { MessageEmbed } = require('discord.js');
const anilist = require('anilist-node');
const Anilist = new anilist();
const emojis = require('../../config/emojis.json');
const Colors = require('../../config/colors.json');
const UserModel = require('../../models/user');

const colors = {
	purple: 'PURPLE',
	red: 'RED',
	pink: '#ff6781',
	blue: 'BLUE',
	orange: 'ORANGE',
	gray: 'GREY',
	green: 'GREEN'
};

const getProfile = async (username) => {
	const profile = await Anilist.user.all(username).catch(err => console.log(err));
	if (profile[0]) return profile[0];
	else return profile;
};

const statusFetcher = (profile, cmd, status) => {
	if (cmd === 'anime') {
		const filteredStatus = profile.statistics.anime.statuses.filter(stats => stats.status === status);
		if (filteredStatus.length !== 0) return filteredStatus[0].count;
		else return 0;
	} else {
		const filteredStatus = profile.statistics.manga.statuses.filter(stats => stats.status === status);
		if (filteredStatus.length !== 0) return filteredStatus[0].count;
		else return 0;
	}
};

module.exports = {
	name: 'al',
	slash: true,
	description: 'Retrieves yours or the specified user\'s AniList stats.',
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
			description: 'Enter AniList username.',
			type: 3
		}
	],
	run: async ({ client, guild, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (args.user && args.username) {
			embed.setColor(Colors.default)
				.setTitle('**Command Usage**')
				.setDescription('Type `/al user:` and select a user from the menu\n\n(**OR**)\n\nType `/al username:<anilist username>`')
				.setFooter('To know your own stats simply write /al');
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		let name;
		let aniUsername;

		if (args.username) {
			name = args.username;
			aniUsername = args.username;
		} else if (args.user) {
			const user = guild.members.cache.get(args.user);
			const userRes = await UserModel.findOne({ id: user.id });
			if (!userRes || !userRes.aniProfile.al) {
				embed.setColor(Colors.red)
					.setDescription(`${TickNo}\u3000The user has not linked their account with Yato`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}
			aniUsername = userRes.aniProfile.al;
			name = user.user.username;
		} else {
			const userRes = await UserModel.findOne({ id: member.user.id });
			if (!userRes || !userRes.aniProfile.al) {
				embed.setColor(Colors.red)
					.setDescription(`${TickNo}\u3000You have not linked your account with Yato\nUse \`set\` command to link your account`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}
			aniUsername = userRes.aniProfile.al;
			name = member.user.username;
		}

		const profile = await getProfile(aniUsername);

		if (profile.status) {
			if (profile.status === 404) {
				embed
					.setTitle(`${TickNo} Error fetching the AniList Account!`)
					.setColor(Colors.red)
					.setDescription(`The provided username is invalid.\n\n(**${aniUsername}**)`);
				return respond({
					content: embed,
					ephemeral: true
				});
			} else if (profile.status === 429) {
				embed
					.setTitle(`${TickNo} Error fetching the AniList Account!`)
					.setColor(Colors.red)
					.setDescription('We are being rate limited, Please use this command after 5 mins.');
				return respond({
					content: embed,
					ephemeral: true
				});
			} else {
				embed
					.setTitle(`${TickNo} Error fetching the AniList Account!`)
					.setColor(Colors.red)
					.setDescription('An unknown error occured, if the error still persists after some time then report in Yato\'s [Support Server](https://discord.gg/mm7Ke8T)');
				return respond({
					content: embed,
					ephemeral: true
				});
			}
		}

		const watching = statusFetcher(profile, 'anime', 'CURRENT');
		const aplanning = statusFetcher(profile, 'anime', 'PLANNING');
		const apaused = statusFetcher(profile, 'anime', 'PAUSED');
		const adropped = statusFetcher(profile, 'anime', 'DROPPED');
		const acompleted = statusFetcher(profile, 'anime', 'COMPLETED');
		const arepeating = statusFetcher(profile, 'anime', 'REPEATING');

		const reading = statusFetcher(profile, 'manga', 'CURRENT');
		const mplanning = statusFetcher(profile, 'manga', 'PLANNING');
		const mpaused = statusFetcher(profile, 'manga', 'PAUSED');
		const mdropped = statusFetcher(profile, 'manga', 'DROPPED');
		const mcompleted = statusFetcher(profile, 'manga', 'COMPLETED');
		const mrepeating = statusFetcher(profile, 'manga', 'REPEATING');

		embed
			.setTitle(`**${name}'s** AniList Statistics`)
			.setColor(colors[profile.options.profileColor] || '#ff6781')
			.addField('🖥️  Anime Stats', [
				`• Episodes: **${profile.statistics.anime.episodesWatched}**`,
				`• Days: **${profile.statistics.anime.minutesWatched > 1440 ? Math.trunc(profile.statistics.anime.minutesWatched / 1440) : (profile.statistics.anime.minutesWatched / 1440).toFixed(1)}**`,
				`• Mean Score: **${profile.statistics.anime.meanScore}**`,
				`• Watching: **${watching}**`,
				`• Planned: **${aplanning}**`,
				`• On Hold: **${apaused}**`,
				`• Dropped: **${adropped}**`,
				`• Repeating: **${arepeating}**`,
				`• Completed: **${acompleted}**`,
				`\u3000 Total: **${profile.statistics.anime.count}**`,
				`\u200b`
			], true)
			.addField('📚  Manga Stats', [
				`• Chapters: **${profile.statistics.manga.chaptersRead}**`,
				`• Volumes: **${profile.statistics.manga.volumesRead}**`,
				`• Mean Score: **${profile.statistics.manga.meanScore}**`,
				`• Reading: **${reading}**`,
				`• Planned: **${mplanning}**`,
				`• On Hold: **${mpaused}**`,
				`• Dropped: **${mdropped}**`,
				`• Repeating: **${mrepeating}**`,
				`• Completed: **${mcompleted}**`,
				`\u3000 Total: **${profile.statistics.manga.count}**`,
				`\u200b`
			], true)
			.setURL(profile.siteUrl)
			.setTimestamp();
		embed.setImage(`https://img.anili.st/user/${profile.id}`);
		if (profile.favourites) {
			const value = [];
			if (profile.favourites.characters) value.push(`• Character: **[${profile.favourites.characters[0].name}](https://anilist.co/character/${profile.favourites.characters[0].id})**`);
			if (profile.favourites.anime[0]) value.push(`• Anime: **[${profile.favourites.anime[0].title.userPreferred}](https://anilist.co/anime/${profile.favourites.anime[0].id})**`);
			if (profile.favourites.manga[0]) value.push(`• Manga: **[${profile.favourites.manga[0].title.userPreferred}](https://anilist.co/manga/${profile.favourites.manga[0].id})**`);
			if (profile.favourites.studios[0]) value.push(`• Studio: **[${profile.favourites.studios[0].name}](https://anilist.co/studio/${profile.favourites.studios[0].id})**`);

			if (value.length) embed.addField('⭐  Favourites', value);
		}

		return respond(embed);
	}
};
