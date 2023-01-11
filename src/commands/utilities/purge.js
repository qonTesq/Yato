const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('gcommands');
const emojis = require('../../config/emojis.json');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'purge',
	slash: true,
	description: 'Purges the messages from the channel!',
	minArgs: 1,
	expectedArgs: '<number:4:How many messages you want to purge?>',
	// guildOnly: '810474313245261824',
	userRequiredPermissions: 'MANAGE_MESSAGES',
	clientRequiredPermissions: 'MANAGE_MESSAGES',
	run: async ({ client, respond, channel }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const value = args.number;
		const TickYes = client.emojis.cache.get(emojis.TickYes);
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (value <= 0) {
			embed
				.setColor(colors.red)
				.setDescription(`${TickNo}\u3000Value must be greater than 0!`);
			respond({
				content: embed,
				ephemeral: true
			});
			return;
		}
		if (value > 100) {
			embed
				.setColor(colors.red)
				.setDescription(`${TickNo}\u3000You can't purge more than 100 messages at a time`);
			respond({
				content: embed,
				ephemeral: true
			});
			return;
		}

		await channel.bulkDelete(value).catch(() => {
			embed
				.setColor(colors.red)
				.setDescription([
					`${TickNo}\u3000An error occured, make sure Yato has access to the channel and has **Manage Messages** permission`,
					`*Messages older than 14 days will not purge, if you still face problems join the support server and report your problem.*`
				]);

			const supportButton = new MessageButton()
				.setStyle('url')
				.setLabel(`Support Server`)
				.setURL(`https://discord.gg/mm7Ke8T`)
				.toJSON();

			const row = new MessageActionRow()
				.addComponent(supportButton);
			respond({
				content: embed,
				components: row,
				ephemeral: true
			});
			return;
		});

		embed
			.setColor(colors.green)
			.setDescription(`${TickYes}\u3000Purged **${value}** messages`);

		respond(embed);
	}
};
