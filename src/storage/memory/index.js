import Storage from '../abstract.js';

export default class MemoryStorage extends Storage {
	constructor() {
		super();

		const {
			NODE_ENV,
			MUSKETEER_MEMORY_STORAGE_WARNING,
		} = process.env;

		if (NODE_ENV === 'production' && MUSKETEER_MEMORY_STORAGE_WARNING !== 'false') {
			/* eslint-disable no-console */
			console.log(`Warning: Musketeer is using the memory storage which should not be used` +
				`in production. If you know what you're doing, and you insist on using the` +
				`memory storage, please set MUSKETEER_MEMORY_STORAGE_WARNING to false.`);
			/* eslint-enable no-console */
		}

		this.state = {};
	}

	getTargetVariantName(experimentName, userID) {
		const participants = this.state[`participants.${experimentName}`] || {};
		return Promise.resolve(participants[userID]);
	}

	getWeights(experimentName) {
		return Promise.resolve(this.state[`weights.${experimentName}`]);
	}

	saveWeights(experimentName, weights, expiry) {
		this.state[`weights.${experimentName}`] = weights;

		const timer = setTimeout(() => {
			delete this.state[`weights.${experimentName}`];
		}, expiry * 1000);

		// We do not want to keep the event loop alive because of this timer.
		timer.unref();

		return Promise.resolve();
	}

	getExperiment(name) {
		return Promise.resolve(this.state[`experiments.${name}`]);
	}

	addParticipant(experimentName, targetVariantName, userID) {
		const participants = this.state[`participants.${experimentName}`] || {};

		if (!participants[userID]) {
			participants[userID] = targetVariantName;

			const experiments = this.state[`experiments.${experimentName}`] || {};
			experiments[`${targetVariantName}.participants`] += 1;
		}

		return Promise.resolve();
	}

	addConversion(experimentName, userID) {
		const targetVariantName = this.getTargetVariantName(experimentName, userID);

		if (targetVariantName) {
			const conversions = this.state[`conversions.${experimentName}`] || {};
			if (!conversions[userID]) {
				conversions[userID] = targetVariantName;

				const experiments = this.state[`experiments.${experimentName}`] || {};
				experiments[`${targetVariantName}.conversions`] += 1;
				return Promise.resolve(true);
			}
		}

		return Promise.resolve(false);
	}
}
