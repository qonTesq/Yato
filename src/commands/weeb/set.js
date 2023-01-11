/* eslint-disable new-cap */
const { MessageEmbed } = require('discord.js');
// const anilist = require('anilist-node');
// const Anilist = new anilist();
const emojis = require('../../config/emojis.json');
const UserModel = require('../../models/user');
const colors = require('../../config/colors.json');

// const getProfile = async (username) => {
// 	const profile = await Anilist.user.all(username).catch(err => console.log(err));
// 	if (profile[0]) return profile[0];
// 	else return profile;
// };

const setProfile = async (profile, username, member) => {
	const res = await UserModel.findOne({ id: member.user.id });
	const profileObj = {};
	if (!res) {
		profileObj[profile] = username;
		await new UserModel({
			name: member.user.username,
			id: member.user.id,
			aniProfile: profileObj
		}).save().catch(err => console.log(err));
	} else {
		profileObj.al = res.aniProfile.al;
		profileObj.mal = res.aniProfile.mal;
		profileObj[profile] = username;
		res.aniProfile = profileObj;
		await res.save().catch(err => console.log(err));
	}
};

module.exports = {
	name: 'set',
	slash: true,
	description: 'Setup your AniList or MyAnimeList accounts',
	// guildOnly: '810474313245261824',
	cooldown: 10,
	expectedArgs: [
		{
			name: 'profile',
			description: 'Select a option',
			type: 3,
			choices: [
				{
					name: 'AniList',
					value: 'al'
				},
				{
					name: 'MyAnimeList',
					value: 'mal'
				}
			],
			required: true
		},
		{
			name: 'username',
			description: 'Enter your username',
			type: 3,
			required: true
		}
	],
	run: async ({ client, member, respond }, arrayArgs, args) => {
		const embed = new MessageEmbed();
		const TickYes = client.emojis.cache.get(emojis.TickYes);

		await setProfile(args.profile, args.username, member);
		embed.setColor(colors.green)
			.setDescription(`${TickYes}\u3000Done`);

		return respond({
			content: embed,
			ephemeral: true
		});
	}
};
