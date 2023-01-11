const CssModel = require('../../models/css');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'editcssserver',
	slash: true,
	description: 'Edit saved CS:S Server data on database',
	guildOnly: '674567417434996736',
	userOnly: ['442525125192187905', '625415951906635789'],
	expectedArgs: [
		{
			name: 'cmd',
			description: 'Enter server command.',
			type: 3,
			required: true
		},
		{
			name: 'ip',
			description: 'Enter server ip',
			type: 3,
			required: true
		},
		{
			name: 'name',
			description: 'Enter server name',
			type: 3,
			required: true
		}
	],
	run: async ({ client, respond }, arrayArgs, args) => {
		const cssRes = await CssModel.findOne({ cmd: args.cmd });
		const TickYes = client.emojis.cache.get(emojis.TickYes);

		if (!cssRes) {
			new CssModel({
				cmd: args.cmd,
				ip: args.ip,
				name: args.name
			}).save().catch(err => console.log(err));
			const str = `${TickYes}\u3000**Server added successfully**`;
			respond({
				content: str,
				ephemeral: true
			});
		} else {
			cssRes.cmd = args.cmd;
			cssRes.ip = args.ip;
			cssRes.name = args.name;
			cssRes.save().catch(err => console.log(err));
			const str = `${TickYes}\u3000**Server edited successfully**`;
			respond({
				content: str,
				ephemeral: true
			});
		}
	}
};
