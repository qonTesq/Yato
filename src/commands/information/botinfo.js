const { MessageEmbed, version: djsversion } = require('discord.js');
const { MessageButton, MessageActionRow } = require('gcommands');
const ms = require('ms');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'botinfo',
	slash: true,
	description: 'Shows detailed information of Yato',
	// guildOnly: '810474313245261824',
	run: ({ client, respond }) => {
		const servers = client.guilds.cache.size.toLocaleString();
		const users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();
		const commands = client.commands.size;
		const str = [
			`Hello, I am **${client.user.username}**, a multi-purpose Discord bot developed by **[ZestY](https://discord.bio/p/zesty)**`,
			`\u200b`,
			`My uptime is **${ms(client.uptime, { long: true })}**, helping **${servers}** servers and **${users}** users with **${commands}** commands`,
			`\u200b`,
			`Currently running on **[Node.js ${process.version}](https://nodejs.org/)** with **[discord.js ${djsversion}](https://discord.js.org/)**`,
			`\u200b`,
			`The name and image is of a anime character from the anime **[Noragami](https://anilist.co/anime/20447/Noragami/)**`,
			`Also check out these useful links below...`
		];
		const embed = new MessageEmbed()
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setColor(colors.default)
			.setDescription(str)
			.setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const inviteButton = new MessageButton()
			.setStyle('url')
			.setLabel(`Invite ${client.user.username}`)
			.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1879436407&scope=bot%20applications.commands`)
			.toJSON();

		const supportButton = new MessageButton()
			.setStyle('url')
			.setLabel('Support Server')
			.setURL('https://discord.gg/mm7Ke8T')
			.toJSON();

		const buttonRow = new MessageActionRow()
			.addComponent(inviteButton)
			.addComponent(supportButton);

		respond({
			content: embed,
			components: buttonRow
		});
	}
};
