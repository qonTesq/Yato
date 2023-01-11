/* eslint-disable new-cap */
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const anilist = require('anilist-node');
const Anilist = new anilist();
const axios = require('axios');
const colors = require('../config/colors.json');

module.exports = {
	cleanHTML(description) {
		if (!description) return '';
		const cleanr = description.toString();
		const cleantext = cleanr.replace(/<(.|\n)*?>/g, '');
		return cleantext;
	},

	descriptionParser(description) {
		description = this.cleanHTML(description);
		if (description.length > 800) {
			return `${description.substring(0, 799)}...`;
		} else {
			return description;
		}
	},

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	domainParser(link) {
		let domain = link.split('/')[2].replace('www.', '').replace('.com', '');
		domain = this.capitalizeFirstLetter(domain);
		return domain;
	},

	formatPerms(perm) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (ss) => ss.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'User Voice Activity');
	},

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	},

	async animeMangaSearch(cmd, query, channel) {
		const MediaStatusToString = {
			FINISHED: 'Finished',
			RELEASING: 'Releasing',
			NOT_YET_RELEASED: 'Not yet released',
			CANCELLED: 'Cancelled'
		};

		let res;
		let filter;

		if (channel.nsfw) filter = null;
		else filter = { isAdult: false };

		if (cmd === 'anime') res = await Anilist.searchEntry.anime(query, filter);
		else res = await Anilist.searchEntry.manga(query, filter);

		if (!res.media.length) return null;

		const data = res.media;
		const embeds = [];
		for (const media of data) {
			let AnimeManga;
			if (cmd === 'anime') AnimeManga = await Anilist.media.anime(media.id);
			else AnimeManga = await Anilist.media.manga(media.id);

			const title = AnimeManga.title.userPreferred;
			const description = this.descriptionParser(AnimeManga.description);

			let timeleft;
			if (AnimeManga.nextAiringEpisode) timeleft = moment.unix(AnimeManga.nextAiringEpisode.airingAt).fromNow();
			else timeleft = 'Never';

			let links = '';
			if (AnimeManga.externalLinks) {
				AnimeManga.externalLinks.forEach(url => {
					const domain = this.domainParser(url);
					links += `[${this.capitalizeFirstLetter(domain)}](${url}), `;
				});
			}
			if (links.length) links = links.slice(0, -2);

			const embed = new MessageEmbed()
				.setTitle(title)
				.setURL(AnimeManga.siteUrl)
				.setColor(AnimeManga.coverImage.color || colors.default)
				.setDescription(description);
			if (cmd === 'anime') {
				embed.setFooter(`Status: ${MediaStatusToString[AnimeManga.status]}, Next Episode: ${timeleft}`);
			} else {
				embed.addField('Chapters', AnimeManga.chapters || 'N/A', true);
				embed.setFooter(`Status: ${AnimeManga.status ? MediaStatusToString[AnimeManga.status] : 'N/A'}`);
			}
			if (links.length) embed.addField('Streaming and/or Info sites', links, true);
			embed.setImage(`https://img.anili.st/media/${AnimeManga.id}`);
			embed.addField('You can find out more', `[AniList](${AnimeManga.siteUrl}), [MyAnimeList](https://myanimelist.net/${cmd}/${AnimeManga.idMal})`);

			embeds.push(embed);
		}

		return embeds;
	},

	async redditFetcher(sub, channel) {
		const url = `https://www.reddit.com/r/${sub}.json?limit=100&sort=top&t=week.json`;
		const res = await axios.get(url).catch(err => {
			console.log(err);
			return null;
		});

		if (res.status === 200) {
			const body = res.data;
			const allowed = channel.nsfw ?
				body.data.children.filter(post =>
					!post.data.stickied && !post.data.media) :
				body.data.children.filter(post =>
					!post.data.over_18 && !post.data.stickied && !post.data.media);

			if (!allowed.length) return null;
			const post = allowed[Math.floor(Math.random() * allowed.length)].data;
			const payload = {
				image: post.url,
				permalink: post.permalink,
				postLink: `https://reddit.com${post.permalink}`,
				subreddit: post.subreddit,
				subredditNamePrefixed: post.subreddit_name_prefixed,
				author: post.author,
				uploadedUTC: post.created_utc * 1000,
				uploaded: post.created * 1000,
				title: post.title,
				score: post.score,
				ups: post.ups,
				downs: post.downs,
				comments: post.num_comments,
				nsfw: post.over_18
			};
			return payload;
		} else {
			console.log(res.status);
			console.log(res.statusText);
			return null;
		}
	}
};
