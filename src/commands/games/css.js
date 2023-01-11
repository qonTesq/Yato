const { MessageEmbed } = require('discord.js');
const { Command } = require('gcommands');
const Gamedig = require('gamedig');
const CssModel = require('../../models/css');
const colors = require('../../config/colors.json');
const CanvasTemplates = require('../../structures/CanvasTemplates');

const gameServerFetcher = async (server) => {
	const res = await Gamedig.query({
		type: 'css',
		host: server.host,
		port: server.port
	}).catch(() => null);

	return res;
};

const serverEmbedMaker = async (embed, serverQuery, server, list) => {
	embed.setTitle(serverQuery.name)
		.setDescription(`Click below to join (**CM ONLY**)\n<clientmod://connect/${server.host}:${server.port}>`)
		.setColor(colors.default)
		.setURL(`https://www.gametracker.com/server_info/${server.host}:${server.port}`)
		.addField('🗺️  Map', `${serverQuery.map}`, true)
		.addField('🎮  Players', `${serverQuery.raw.numplayers}/${serverQuery.maxplayers} (${serverQuery.raw.numbots} bots)`, true)
		.addField('🌍  Address', `\`${serverQuery.connect}\``)
		.addField('🔐  Visibility', serverQuery.password ? 'Password Protected' : 'Public', true)
		.setThumbnail('https://imgur.com/2GXRNQH.png');
	embed.addField('⚙️  Server Type', `${serverQuery.raw.listentype === 'd' ? serverQuery.raw.listentype === 'p' ? 'Source TV' : 'Dedicated' : 'Non-Dedicated'}`, true);

	if (serverQuery.raw.numplayers !== serverQuery.raw.numbots && list === true) {
		const imageBuffer = await CanvasTemplates.playerListImage(serverQuery);
		embed.attachFiles([{ attachment: imageBuffer, name: 'list.png' }])
			.setImage('attachment://list.png');
	}
	return embed;
};

module.exports = class CSS extends Command {

	constructor(...args) {
		return (async () => {
			const choices = [];
			const servers = await CssModel.find({}).sort({ name: 1 });
			servers.forEach(server => {
				const choice = {};
				choice.name = server.name;
				choice.value = `${server.ip}|${server.cmd}`;
				choices.push(choice);
			});
			return super(...args, {
				name: 'css',
				slash: true,
				description: 'Check Counter Strike Source Servers',
				// guildOnly: '674567417434996736',
				args: [
					{
						name: 'server',
						description: 'Select a CS:S Server',
						type: 3,
						choices: choices
					},
					{
						name: 'ip',
						description: 'Enter CS:S Server IP Address',
						type: 3
					}
				]
			});
		})();
	}

	async run({ respond }, arrayArgs, args) {
		const embed = new MessageEmbed();

		if (Object.keys(args).length === 0 || Object.keys(args).length > 1) {
			embed.setColor(colors.default)
				.setTitle('**Command Usage**')
				.setDescription('Type `/css ip:<ip>[:port]`\n\n(**OR**)\n\nType `/css server:` and select a server from the menu')
				.setFooter('<> is required and [] is optional | Server port defaults to 27015');
			return respond(embed);
		}

		if (args.ip) {
			const [host, port = 27015] = args.ip.split(':');
			const server = {
				host: host,
				port: port
			};
			const serverQuery = await gameServerFetcher(server);
			if (!serverQuery || serverQuery.raw.appId !== 240) {
				embed.setColor(colors.red)
					.setDescription(`:warning:\u3000Unable to connect to the Server (\`${server.host}:${server.port}\`)`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}

			const finalEmbed = await serverEmbedMaker(embed, serverQuery, server, false);
			return respond(finalEmbed);
		} else {
			let server = args.server.split('|');
			const [host, port = 27015] = server[0].split(':');
			server = {
				host: host,
				port: port
			};
			const serverQuery = await gameServerFetcher(server);
			if (!serverQuery || serverQuery.raw.appId !== 240) {
				embed.setColor(colors.red)
					.setDescription(`:warning:\u3000Unable to connect to the Server (\`${server.host}:${server.port}\`)`);
				return respond({
					content: embed,
					ephemeral: true
				});
			}

			const finalEmbed = await serverEmbedMaker(embed, serverQuery, server, true);
			return respond(finalEmbed);
		}
	}

};
