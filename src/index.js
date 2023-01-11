/* eslint-disable no-process-env */
require('dotenv').config();
require('./structures/CanvasUtils').initializeHelpers();
const Discord = require('discord.js');
const { GCommands } = require('gcommands');
const mongoose = require('mongoose');
const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'] } });

client.on('ready', async () => {
	console.log(`➤ Logged in as ${client.user.tag} (${client.user.id})`);
	await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => console.log('✔ Connected to MongoDB'))
		.catch(err => console.log(`✖ Failed to connect to MongoDB\n${err}`));

	const GCommandsClient = new GCommands(client, {
		cmdDir: 'src/commands/',
		language: 'english',
		ownLanguageFile: require('./config/message.json'),
		unkownCommandMessage: true,
		slash: {
			slash: 'both',
			prefix: `^<@!?${client.user.id}> `
		},
		defaultCooldown: '3s'
	});

	GCommandsClient.on('log', (log) => {
		console.log(log);
	});

	GCommandsClient.on('debug', (debug) => {
		console.log(debug);
	});

	const statuses = [
		`/help | @Yato help`,
		`${client.guilds.cache.size} Servers!`
	];
	setInterval(() => {
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		client.user.setPresence({ activity: { name: status, type: 'LISTENING' }, status: 'idle' });
	}, 15000);
});

client.login(process.env.TOKEN);
