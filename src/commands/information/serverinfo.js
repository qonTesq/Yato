const { MessageEmbed } = require('discord.js');
const savedEmojis = require('../../config/emojis.json');
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

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

module.exports = {
	name: 'serverinfo',
	slash: true,
	description: 'Shows detailed information of the server.',
	// guildOnly: '810474313245261824',
	run: ({ client, guild, respond }) => {
		const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = guild.members.cache;
		const channels = guild.channels.cache;
		const emojis = guild.emojis.cache;
		const online = client.emojis.cache.get(savedEmojis.Online);
		const offline = client.emojis.cache.get(savedEmojis.Offline);
		const idle = client.emojis.cache.get(savedEmojis.Idle);
		const dnd = client.emojis.cache.get(savedEmojis.DND);

		const embed = new MessageEmbed()
			.setColor(colors.gray)
			.setDescription(`⛩️ **Server information for __${guild.name}__**`)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addField('📝  General', [
				`Name: **${guild.name}**`,
				`ID: **${guild.id}**`,
				`Owner: **${guild.owner.user.tag}** (\`${guild.ownerID}\`)`,
				`Region: **${regions[guild.region]}**`,
				`Boost Tier: **${guild.premiumTier ? `Tier ${guild.premiumTier}` : 'None'}**`,
				`Explicit Filter: **${filterLevels[guild.explicitContentFilter]}**`,
				`Verification Level: **${verificationLevels[guild.verificationLevel]}**`,
				`Time Created: ${moment(guild.createdTimestamp).format('LT')} ${moment(guild.createdTimestamp).format('LL')} **${moment(guild.createdTimestamp).fromNow()}**`,
				'\u200b'
			])
			.addField('📊  Statistics', [
				`Role Count: **${roles.length}**`,
				`Emoji Count: **${emojis.size}**`,
				`Regular Emoji Count: **${emojis.filter(emoji => !emoji.animated).size}**`,
				`Animated Emoji Count: **${emojis.filter(emoji => emoji.animated).size}**`,
				`Member Count: **${guild.memberCount}**`,
				`Humans: **${members.filter(member => !member.user.bot).size}**`,
				`Bots: **${members.filter(member => member.user.bot).size}**`,
				`Text Channels: **${channels.filter(channel => channel.type === 'text').size}**`,
				`Voice Channels: **${channels.filter(channel => channel.type === 'voice').size}**`,
				`Boost Count: **${guild.premiumSubscriptionCount || '0'}**`,
				'\u200b'
			], true)
			.addField('👀  Presence', [
				`${online}  Online: **${members.filter(member => member.presence.status === 'online').size}**`,
				`${idle}  Idle: **${members.filter(member => member.presence.status === 'idle').size}**`,
				`${dnd}  Do Not Disturb: **${members.filter(member => member.presence.status === 'dnd').size}**`,
				`${offline}  Offline: **${members.filter(member => member.presence.status === 'offline').size}**`,
				'\u200b'
			], true)
			.addField(`🗃️  Roles [${roles.length}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None', true)
			.setTimestamp();

		respond(embed);
	}
};
