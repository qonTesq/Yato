module.exports = {
	name: 'say',
	slash: true,
	description: 'A simple command that repeats the user\'s input message.',
	// guildOnly: '810474313245261824',
	expectedArgs: [
		{
			name: 'message',
			description: 'Enter the message that you want the bot to repeat',
			type: 3,
			required: true
		}
	],
	run: ({ channel, respond }, arrayArgs, args) => {
		channel.send(args.message);
		respond({
			content: `Echo Message : ${args.message}`,
			ephemeral: true
		});
	}
};
