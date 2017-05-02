export default class InfoController {
	constructor(storage) {
		this.storage = storage;
	}

	async info(experimentName) {
		const experiment = await this.storage.getExperiment(experimentName) || {};
		const variants = Object.keys(experiment).reduce((variants, key) => {
			const count = parseInt(experiment[key], 10);
			const [
				variantName,
				type,
			] = key.split('.');

			if (!variants[variantName]) {
				variants[variantName] = {};
			}

			const variant = variants[variantName];
			variant[type] = count;
			return variants;
		}, {});

		Object.keys(variants).forEach((variantName) => {
			const variant = variants[variantName];

			if (variant.participants > 0) {
				variant.conversionRate = variant.conversions / variant.participants;
			}
		});

		return {
			name: experimentName,
			variants,
		};
	}
}
