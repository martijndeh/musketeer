import Storage from '../abstract.js';
import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default class RedisStorage extends Storage {
	constructor(connectionUrl) {
		super();

		this.client = redis.createClient(connectionUrl);
	}

	getTargetVariantName(experimentName, userID) {
		return this.client.hgetAsync(`participants.${experimentName}`, userID);
	}

	async getWeights(experimentName) {
		const weightsAsStrings = await this.client.hgetallAsync(`weights.${experimentName}`);

		if (weightsAsStrings) {
			const variantNames = Object.keys(weightsAsStrings);
			return variantNames.reduce((weights, variantName) => {
				weights[variantName] = parseFloat(weightsAsStrings[variantName]);
				return weights;
			}, {});
		}

		return null;
	}

	saveWeights(experimentName, weights, expiry) {
		// TODO: If expiry is 0, we can just set the key and call it a day.

		return this.client
			.multi()
			.hmset(`weights.${experimentName}`, weights)
			.expire(`weights.${experimentName}`, expiry)
			.execAsync();
	}

	getExperiment(name) {
		return this.client.hgetallAsync(`experiments.${name}`);
	}

	async addParticipant(experimentName, targetVariantName, userID) {
		const result = await this.client.hsetnxAsync(`participants.${experimentName}`, userID, targetVariantName);

		if (result === 1) {
			await this.client.hincrbyAsync(`experiments.${experimentName}`, `${targetVariantName}.participants`, 1);
		}
	}

	async addConversion(experimentName, userID) {
		const targetVariantName = await this.getTargetVariantName(experimentName, userID);

		if (targetVariantName) {
			const result = await this.client.hsetnxAsync(`conversions.${experimentName}`, userID, targetVariantName);

			if (result === 1) {
				await this.client.hincrbyAsync(`experiments.${experimentName}`, `${targetVariantName}.conversions`, 1);
				return true;
			}
		}

		return false;
	}
}
