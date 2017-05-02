/* eslint-disable no-mixed-operators */
function rbeta(a, b) {
	const sum = a + b;
	const ratio = a / b;
	const min = Math.min(a, b);

	let y = 0;
	let lhs = 0;
	let rhs = 0;

	const lambda = min <= 1
		? min
		: Math.sqrt((2 * a * b - a - b) / (sum - 2));

	do {
		const r1 = Math.random();
		const r2 = Math.random();

		y = Math.pow(1 / r1 - 1, 1 / lambda);

		lhs = 4 * r1 * r2 * r2;
		rhs = Math.pow(y, a - lambda) * Math.pow((1 + ratio) / (1 + ratio * y), sum);
	} while (lhs >= rhs);

	return ratio * y / (1 + ratio * y);
}
/* eslint-enable no-mixed-operators */

function getRandomVariantName(experiment, variantNames) {
	let targetIndex = 0;
	let maxScore = 0;

	variantNames.forEach((variantName, index) => {
		const participants = parseInt(experiment[`${variantName}.participants`], 10) || 0;
		const conversions = parseInt(experiment[`${variantName}.conversions`], 10) || 0;

		const score = rbeta(1 + conversions, 1 + participants - conversions);

		if (score > maxScore) {
			maxScore = score;
			targetIndex = index;
		}
	});

	return variantNames[targetIndex];
}

export default class BanditExperimentType {
	static expiry = 15;

	static calculateWeights(experiment, variants) {
		const variantNames = Object.keys(variants);
		const weights = variantNames.reduce((weights, variantName) => {
			weights[variantName] = 0;
			return weights;
		}, {});

		// TODO: Replace the below with some sane calculations, instead of a brute force search.
		const max = 500;
		for (let i = 0; i < max; i += 1) {
			const variantName = getRandomVariantName(experiment, variantNames);
			weights[variantName] += 1 / max;
		}

		return weights;
	}
}
