const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { Util: { escapeMarkdown } } = require('discord.js');
const colors = require('../../config/colors.json');

module.exports = {
	name: 'minecraft',
	slash: true,
	description: 'Check Minecraft Servers',
	// guildOnly: '810474313245261824',
	minArgs: 1,
	expectedArgs: [
		{
			name: 'ip',
			description: 'Enter Minecraft Server IP',
			type: 3,
			required: true
		}
	],
	run: async ({ respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const [host, port] = args.ip.split(':');

		const serverRes = await axios.get(`https://api.mcsrvstat.us/2/${host}${port ? `:${port}` : ''}`).catch(err => console.log(err));
		if (serverRes.data.online) {
			embed.setTitle('Minecraft Server')
				.setColor(colors.default)
				.setDescription(escapeMarkdown(`${serverRes.data.motd.raw[0].replace(/§[0-9a-fk-or]/g, '')}\n${serverRes.data.motd.raw[1] ? serverRes.data.motd.raw[1].replace(/§[0-9a-fk-or]/g, '') : ''}`))
				.addField('📡  Status', 'Online  `🟢`', true)
				.addField('🎮  Players', `${serverRes.data.players.online}/${serverRes.data.players.max}`, true)
				.addField('🌍  Address', `\`${args.ip}\``)
				.addField('⚙️  Software', serverRes.data.software || 'N/A', true)
				.addField('🌐  Version', serverRes.data.version, true)
				.setThumbnail(`https://mc-api.net/v3/server/favicon/${args.ip}`)
				.setImage(`http://status.mclive.eu/${host}/${host}/${port || '25565'}/banner.png`)
				.setTimestamp();
			respond(embed);
		} else {
			embed.setColor(colors.red)
				.setDescription(`:warning:\u3000**Unable to connect to the Server** (${host}${port ? `:${port}` : ''})`);
			respond({
				content: embed,
				ephemeral: true
			});
		}
	}
};
