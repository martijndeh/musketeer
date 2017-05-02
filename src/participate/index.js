export default class ParticipateController {
	constructor(storage, experimentTypes) {
		this.storage = storage;
		this.experimentTypes = experimentTypes;
	}

	/**
	 * Calculate a random variant based on the weight per variant.
	 *
	 * @param {Object} weights A hash with variant names and weights.
	 * @returns {String} A random variant name e.g. A or B.
	 **/
	getRandomVariantName(weights) {
		const variantNames = Object.keys(weights);
		const totalWeight = variantNames.reduce((weight, variantName) => {
			return weight + weights[variantName];
		}, 0);

		// Math.random() returns a number from 0 (inclusive) up to but not including 1 (exclusive).
		// So random is 0 (inclusive) up to totalWeight (exclusive).
		const random = Math.random() * totalWeight;

		let weight = 0;

		for (let i = 0; i < variantNames.length; i += 1) {
			const variantName = variantNames[i];
			weight += weights[variantName];

			if (random < weight) {
				return variantName;
			}
		}
	}

	/**
	 * Creates an empty experiment with all variants and the conversions and participants set to 0.
	 *
	 * @param {String[]} variantNames A list of variant names e.g. A, B.
	 * @returns {Object} An empty experiment object.
	 **/
	createEmptyExperiment(variantNames) {
		return variantNames.reduce((experiment, variantName) => ({
			...experiment,
			[`${variantName}.participants`]: 0,
			[`${variantName}.conversions`]: 0,
		}), {});
	}

	async participate(experimentName, userID, options) {
		// TODO: Should we create the experiment so we know the start date. Or should we start the
		// experiment when the first conversion is created?
		const {
			variants,
		} = options;
		const targetVariantName = await this.storage.getTargetVariantName(experimentName, userID);

		if (targetVariantName) {
			// TODO: Check if this variant really exists. If not, fall back to a random variant?

			return variants[targetVariantName];
		}

		const experimentType = this.experimentTypes[options.type];

		let weights = await this.storage.getWeights(experimentName);

		if (!weights) {
			const experiment = await this.storage.getExperiment(experimentName) || this.createEmptyExperiment(Object.keys(variants));
			weights = experimentType.calculateWeights(experiment, variants);

			await this.storage.saveWeights(experimentName, weights, options.expiry || experimentType.expiry);
		}

		const randomVariantName = this.getRandomVariantName(weights);

		await this.storage.addParticipant(experimentName, randomVariantName, userID);

		// TODO: Check if variants[randomVariantName] exists.

		return variants[randomVariantName];
	}
}
