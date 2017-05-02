'use strict';

var _bandit = require('../bandit.js');

var _bandit2 = _interopRequireDefault(_bandit);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('BanditExperimentType', function () {
	it('should calculate equal weight without conversions', function () {
		var experiment = {
			'A.participants': '0',
			'A.conversions': '0',
			'B.participants': '0',
			'B.conversions': '0'
		};
		var variants = {
			A: 'Variant A',
			B: 'Variant B'
		};

		var weights = _bandit2.default.calculateWeights(experiment, variants);

		_assert2.default.equal(Math.abs(weights.A - weights.B) < 0.1, true);
	});

	it('should calculate equal weight without conversions', function () {
		var experiment = {
			'A.participants': '100',
			'A.conversions': '20',
			'B.participants': '100',
			'B.conversions': '40'
		};
		var variants = {
			A: 'Variant A',
			B: 'Variant B'
		};

		var weights = _bandit2.default.calculateWeights(experiment, variants);

		_assert2.default.equal(weights.A < weights.B, true);
	});
});