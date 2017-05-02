import BanditExperimentType from '../bandit.js';
import assert from 'assert';

describe('BanditExperimentType', () => {
	it('should calculate equal weight without conversions', () => {
		const experiment = {
			'A.participants': '0',
			'A.conversions': '0',
			'B.participants': '0',
			'B.conversions': '0',
		};
		const variants = {
			A: 'Variant A',
			B: 'Variant B',
		};

		const weights = BanditExperimentType.calculateWeights(experiment, variants);

		assert.equal(Math.abs(weights.A - weights.B) < 0.1, true);
	});

	it('should calculate equal weight without conversions', () => {
		const experiment = {
			'A.participants': '100',
			'A.conversions': '20',
			'B.participants': '100',
			'B.conversions': '40',
		};
		const variants = {
			A: 'Variant A',
			B: 'Variant B',
		};

		const weights = BanditExperimentType.calculateWeights(experiment, variants);

		assert.equal(weights.A < weights.B, true);
	});
});
