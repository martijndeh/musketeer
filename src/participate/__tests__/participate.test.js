import ParticipateController from '../index.js';
import assert from 'assert';
import sinon from 'sinon';
import experimentTypes from '../../experiment-types/index.js';

describe('ParticipateController', () => {
	describe('getRandomVariantName', () => {
		const participateController = new ParticipateController(null);

		afterEach(() => {
			Math.random.restore();
		});

		const weights = {
			A: 1,
			B: 1,
			C: 1,
		};

		it('should select A at 0 / 3', () => {
			sinon.stub(Math, 'random', () => 0 / 3);

			assert.equal(participateController.getRandomVariantName(weights), 'A');
		});

		it('should select B at 1 / 3', () => {
			sinon.stub(Math, 'random', () => 1 / 3);

			assert.equal(participateController.getRandomVariantName(weights), 'B');
		});

		it('should select B at 2 / 3 - 0.0001', () => {
			sinon.stub(Math, 'random', () => 2 / 3 - 0.0001);

			assert.equal(participateController.getRandomVariantName(weights), 'B');
		});

		it('should select C at 2 / 3', () => {
			sinon.stub(Math, 'random', () => 2 / 3);

			assert.equal(participateController.getRandomVariantName(weights), 'C');
		});
	});

	describe('createEmptyExperiment', () => {
		const participateController = new ParticipateController(null);

		it('should return empty experiment with two variants', () => {
			const experiment = participateController.createEmptyExperiment([
				'A',
				'B',
			]);

			assert.deepEqual(experiment, {
				'A.participants': 0,
				'A.conversions': 0,
				'B.participants': 0,
				'B.conversions': 0,
			});
		});
	});

	describe('participate', () => {
		it('should return existing variant and not call addParticipant', async () => {
			const userID = 1;
			const variants = {
				A: 'http://www.ff00ff.nl/',
				B: 'http://www.musketeer.ai/',
			};
			const storage = {
				getTargetVariantName: () => Promise.resolve('A'),
				getWeights: () => Promise.resolve(),
				addParticipant: sinon.spy(),
			};
			const participateController = new ParticipateController(storage);
			const variant = await participateController.participate('Test', userID, {
				type: 'bandit',
				variants,
			});

			assert.equal(variant, variants.A);
		});

		it('should reuse existing weights and call addParticipant', async () => {
			const userID = 1;
			const variants = {
				A: 'http://www.ff00ff.nl/',
				B: 'http://www.musketeer.ai/',
			};
			const storage = {
				getTargetVariantName: () => Promise.resolve(null),
				getWeights: () => Promise.resolve({
					A: 0,
					B: 1,
				}),
				addParticipant: sinon.spy(),
				getExperiment: () => Promise.resolve(null),
			};
			const participateController = new ParticipateController(storage, experimentTypes);
			const variant = await participateController.participate('Test', userID, {
				type: 'bandit',
				variants,
			});

			assert.equal(variant, variants.B);
			assert.equal(storage.addParticipant.callCount, 1);
		});
	});
});
