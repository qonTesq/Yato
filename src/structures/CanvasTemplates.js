/* eslint-disable id-length */
const { createCanvas } = require('canvas');
const { measureText } = require('./CanvasUtils');
const ms = require('ms');

module.exports = class CanvasTemplates {

	static async playerListImage(query) {
		let players = query.players.sort((a, b) => b.raw.score - a.raw.score);
		players = players.filter(value => Object.keys(value).length !== 0);
		players = players.slice(0, 10);

		const WIDTH = 720;
		const HEIGHT = players.length * 73;
		const font = 'bold 30px "Montserrat"';

		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');

		ctx.lineWidth = 1;
		ctx.font = font;

		const x = 0;
		let y = 0;
		const width = WIDTH;
		const height = 65;
		players.forEach((player, i) => {
			// Gray Bar
			ctx.fillStyle = '#494c52';
			ctx.roundRect(x, y, width, height, 10, true, false);

			// White Number Box
			const NUMBER_BOX_WIDTH = 85;
			const NUMBER_BOX_HEIGHT = height;
			ctx.save();
			i++;
			ctx.fillStyle = '#D4D4D4';
			ctx.roundRect(x, y, NUMBER_BOX_WIDTH, NUMBER_BOX_HEIGHT, 10, true, false);

			// Number
			ctx.fillStyle = i === 1 ? '#E3BE00' : i === 2 ? '#494c52' : i === 3 ? '#bd7835' : '#000000';
			if (i === 1 || i === 2 || i === 3) {
				ctx.shadowColor = '#000000';
				ctx.shadowBlur = 2;
			}
			ctx.textAlign = 'center';
			ctx.write(`#${i}`, NUMBER_BOX_WIDTH / 2, y + 45.5, font);

			// Player Name
			ctx.fillStyle = '#D4D4D4';
			ctx.textAlign = 'left';
			let str = `${player.name}`;
			const nameWidth = measureText(ctx, 'bold 25px "Segoe UI"', str).width;
			if (360 - nameWidth <= 0) str = `${str.substring(0, 355)}...`;
			ctx.write(str, NUMBER_BOX_WIDTH + 10, y + 40, 'bold 25px "Segoe UI"');

			// Score & Time
			let time;
			if (player.raw.time) time = ms(Math.round(player.raw.time) * 1000);
			ctx.textAlign = 'left';
			ctx.write(`${player.raw.score || player.raw.score === 0 ? player.raw.score : 'N/A'} • ${player.raw.time ? time : 'N/A'}`, WIDTH - 120, y + 40, 'bold 20px "Montserrat"');

			ctx.restore();
			y += 73;
		});
		return canvas.toBuffer();
	}

};
