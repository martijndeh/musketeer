import assert from 'assert';
import Storage from './storage/index.js';
import ConvertController from './convert/index.js';
import ParticipateController from './participate/index.js';
import InfoController from './info/index.js';
import experimentTypes from './experiment-types/index.js';

const {
	MUSKETEER_STORAGE_URL,
} = process.env;

const storage = Storage.create(MUSKETEER_STORAGE_URL);
const participateController = new ParticipateController(storage, experimentTypes);
const convertController = new ConvertController(storage);
const infoController = new InfoController(storage);

export default {
	participate(experimentName, userID, variantValues) {
		const options = Array.isArray(variantValues)
			? {
				type: 'bandit',
				variants: variantValues.reduce((variants, variantValue, index) => {
					const variantName = String.fromCharCode(65 + index);
					variants[variantName] = variantValue;
					return variants;
				}, {}),
			}
			: variantValues;

		assert(Object.keys(options.variants).length > 1,
			`Musketeer#participate(): There should be at least two variants in experiment` +
			`"${experimentName}", but only ${Object.keys(options.variants).length} provided.`);

		assert(experimentTypes[options.type],
			`Musketeer#participate(): Unknown experiment type "${options.type}". Valid options ` +
			`are: ${Object.keys(experimentTypes).join(', ')}.`);

		return participateController.participate(experimentName, userID, options);
	},

	convert(experimentName, userID) {
		return convertController.convert(experimentName, userID);
	},

	info(experimentName) {
		return infoController.info(experimentName);
	},
};
