const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('gcommands');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'help',
	description: 'Yato\'s Help Menu',
	// guildOnly: '810474313245261824',
	run: ({ client, member, respond }) => {
		const str = [
			`Hello, I got a cool new website for me, It has all the commands explained in detailed`,
			`\u200b`,
			`If you still need help understanding then you can join Yato's Support Server for questions or issues`
		];
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setColor(colors.default)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter(`Requested by ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setTimestamp()
			.setDescription(str);

		const websiteButton = new MessageButton()
			.setStyle('url')
			.setLabel(`Website`)
			.setURL(`https://yatobot.netlify.app`)
			.toJSON();

		const supportButton = new MessageButton()
			.setStyle('url')
			.setLabel(`Support Server`)
			.setURL(`https://discord.gg/mm7Ke8T`)
			.toJSON();

		const row = new MessageActionRow()
			.addComponent(websiteButton)
			.addComponent(supportButton);

		respond({
			content: embed,
			components: row
		});
	}
};
