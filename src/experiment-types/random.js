export default class RandomExperimentType {
	static expiry = 0;

	static calculateWeights(experiment, variants) {
		const variantNames = Object.keys(variants);
		return variantNames.reduce((weights, variantName) => {
			weights[variantName] = 1;
			return weights;
		}, {});
	}
}
