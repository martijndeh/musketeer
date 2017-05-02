import Musketeer from '../src/index.js';

let index = 0;

async function test() {
	const userID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

	const variant = await Musketeer.participate('MyBasicTest', userID, [
		'Variant A',
		'Variant B',
	]);

	if (Math.random() < 0.25) {
		await Musketeer.convert('MyBasicTest', userID);
	}

	index++;

	if (index % 25 === 0) {
		const experiment = await Musketeer.info('MyBasicTest');
		console.log(experiment);
	}

	setTimeout(test, 1000);
}

test();
