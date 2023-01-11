/* eslint-disable prefer-destructuring */
const { MessageEmbed } = require('discord.js');
const emojis = require('../../config/emojis.json');
const moment = require('moment');
const colors = require('../../config/colors.json');

const trimArray = (arr, maxLen = 10) => {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more...`);
	}
	return arr;
};

const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

const clientStatus = {
	web: '**Web**\u3000🌍',
	desktop: '**Desktop**\u3000🖥️',
	mobile: '**Mobile**\u3000📱'
};

module.exports = {
	name: 'userinfo',
	slash: true,
	description: 'Shows detailed information of yours or the provided user',
	// guildOnly: '810474313245261824',
	expectedArgs: [
		{
			name: 'user',
			description: 'Select a user',
			type: 6
		}
	],
	run: ({ client, guild, member, respond }, arrayArgs, args) => {
		const online = client.emojis.cache.get(emojis.Online);
		const offline = client.emojis.cache.get(emojis.Offline);
		const idle = client.emojis.cache.get(emojis.Idle);
		const dnd = client.emojis.cache.get(emojis.DND);
		const status = {
			online: `Online ${online}`,
			idle: `Idle ${idle}`,
			dnd: `DND ${dnd}`,
			offline: `Offline or Invisible ${offline}`
		};

		let gmember;
		if (args.user) {
			gmember = guild.members.cache.get(args.user);
		} else {
			gmember = guild.members.cache.get(member.user.id);
		}
		const roles = gmember.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		let userFlags;
		if (gmember.user.flags) {
			userFlags = gmember.user.flags.toArray();
		} else {
			userFlags = 0;
		}
		let userStatus;
		if (gmember.user.presence.clientStatus) {
			userStatus = Object.keys(gmember.user.presence.clientStatus);
			userStatus = userStatus.map(sta => clientStatus[sta]);
		}
		const embed = new MessageEmbed()
			.setThumbnail(gmember.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.addField('🔰  User', [
				`Username: **${gmember.user.username}**`,
				`Discriminator: **${gmember.user.discriminator}**`,
				`ID: **${gmember.id}**`,
				`Flags: **${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}**`,
				`Avatar: **[Link to avatar](${gmember.user.displayAvatarURL({ dynamic: true })})**`,
				`Time Created: ${moment(gmember.user.createdTimestamp).format('LT')} ${moment(gmember.user.createdTimestamp).format('LL')} **${moment(gmember.user.createdTimestamp).fromNow()}**`,
				`Status: **${status[gmember.user.presence.status]}**`,
				`Game: **${gmember.user.presence.game || 'Not playing a game'}**`,
				`Currently active on: \n\u3000 ${userStatus ? userStatus.toString().replace(/,/g, '• ') : ''}`,
				`\u200b`
			])
			.addField('⛩️  Member', [
				`Highest Role: **${gmember.roles.highest.id === guild.id ? 'None' : gmember.roles.highest.name}**`,
				`Server Join Date: **${moment(gmember.joinedTimestamp).format('LL LTS')}**`,
				`Hoist Role: **${gmember.roles.hoist ? gmember.roles.hoist.name : 'None'}**`,
				`Roles: **[${roles.length}]**: ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None'}`,
				`\u200b`
			]);
		if (gmember.roles.highest.color) {
			embed.setColor(gmember.roles.highest.color);
		} else {
			embed.setColor(colors.gray);
		}

		respond(embed);
	}
};
