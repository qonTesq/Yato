/* eslint-disable quote-props */
/* eslint-disable camelcase */
/* eslint-disable no-process-env */
const { Command } = require('gcommands');
const axios = require('axios');
const { MessageEmbed, Permissions } = require('discord.js');
const emojis = require('../../config/emojis.json');
const { MessageButton, MessageActionRow } = require('gcommands');
const colors = require('../../config/colors.json');

require('dotenv').config();

const activities = {
	'755600276941176913': 'YouTube Together',
	'755827207812677713': 'Poker Night',
	'814288819477020702': 'Fishington.io',
	'773336526917861400': 'Betrayal.io'
};

module.exports = class Activities extends Command {

	constructor(...args) {
		super(...args, {
			name: 'activities',
			slash: true,
			description: 'The all new Discord Activities (BETA)',
			// guildOnly: '674567417434996736',
			args: [
				{
					name: 'voicechannel',
					type: '7',
					description: 'Select Voice Channel',
					required: true
				},
				{
					name: 'activity',
					type: '3',
					description: 'Discord Activites',
					required: true,
					choices: [
						{
							name: 'YouTube Together',
							value: '755600276941176913'
						},
						{
							name: 'Poker Night (Up to 7 participants)',
							value: '755827207812677713'
						},
						{
							name: 'Fishington.io',
							value: '814288819477020702'
						},
						{
							name: 'Betrayal.io (Up to 12 participants)',
							value: '773336526917861400'
						}
					]
				}
			],
			userRequiredPermissions: 'CREATE_INSTANT_INVITE',
			cooldown: 10
		});
	}

	async run({ client, guild, respond }, arrayArgs, args) {
		const channel = guild.channels.cache.get(args.voicechannel);
		const embed = new MessageEmbed();
		const TickYes = client.emojis.cache.get(emojis.TickYes);
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (channel.type !== 'voice') {
			embed.setColor(colors.red);
			embed.setDescription(`${TickNo}\u3000Invalid Channel! Please choose only **Voice Channels**`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		const clientPerms = new Permissions(['CREATE_INSTANT_INVITE']).freeze();
		const missing = channel.permissionsFor(guild.me).missing(clientPerms);
		if (missing.length) {
			embed.setColor(colors.red);
			embed.setDescription(`${TickNo}\u3000Yato doesn't have **Create Invite** permission in ${channel}`);
			return respond({
				content: embed,
				ephemeral: true
			});
		}

		const res = await axios({
			method: 'post',
			url: `https://discord.com/api/v8/channels/${channel.id}/invites`,
			data: JSON.stringify({
				max_age: 86400,
				max_uses: 0,
				target_application_id: args.activity,
				target_type: 2,
				temporary: false,
				validate: null
			}),
			headers: {
				Authorization: `Bot ${process.env.TOKEN}`,
				'Content-Type': 'application/json'
			}
		});

		const invite = res.data;
		if (!invite.code) return respond(`${TickNo}  Could not start **${activities[args.activity]}**!`);
		const button = new MessageButton()
			.setStyle('url')
			.setLabel('Join')
			.setURL(`https://discord.gg/${invite.code}`)
			.toJSON();
		const buttonRow = new MessageActionRow()
			.addComponent(button);
		return respond({
			content: `${TickYes}  **${activities[args.activity]}** started in \`${channel.name}\``,
			components: buttonRow
		});
	}

};
