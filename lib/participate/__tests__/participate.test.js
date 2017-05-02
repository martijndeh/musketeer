'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _index3 = require('../../experiment-types/index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('ParticipateController', function () {
	describe('getRandomVariantName', function () {
		var participateController = new _index2.default(null);

		afterEach(function () {
			Math.random.restore();
		});

		var weights = {
			A: 1,
			B: 1,
			C: 1
		};

		it('should select A at 0 / 3', function () {
			_sinon2.default.stub(Math, 'random', function () {
				return 0 / 3;
			});

			_assert2.default.equal(participateController.getRandomVariantName(weights), 'A');
		});

		it('should select B at 1 / 3', function () {
			_sinon2.default.stub(Math, 'random', function () {
				return 1 / 3;
			});

			_assert2.default.equal(participateController.getRandomVariantName(weights), 'B');
		});

		it('should select B at 2 / 3 - 0.0001', function () {
			_sinon2.default.stub(Math, 'random', function () {
				return 2 / 3 - 0.0001;
			});

			_assert2.default.equal(participateController.getRandomVariantName(weights), 'B');
		});

		it('should select C at 2 / 3', function () {
			_sinon2.default.stub(Math, 'random', function () {
				return 2 / 3;
			});

			_assert2.default.equal(participateController.getRandomVariantName(weights), 'C');
		});
	});

	describe('createEmptyExperiment', function () {
		var participateController = new _index2.default(null);

		it('should return empty experiment with two variants', function () {
			var experiment = participateController.createEmptyExperiment(['A', 'B']);

			_assert2.default.deepEqual(experiment, {
				'A.participants': 0,
				'A.conversions': 0,
				'B.participants': 0,
				'B.conversions': 0
			});
		});
	});

	describe('participate', function () {
		it('should return existing variant and not call addParticipant', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
			var userID, variants, storage, participateController, variant;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							userID = 1;
							variants = {
								A: 'http://www.ff00ff.nl/',
								B: 'http://www.musketeer.ai/'
							};
							storage = {
								getTargetVariantName: function getTargetVariantName() {
									return Promise.resolve('A');
								},
								getWeights: function getWeights() {
									return Promise.resolve();
								},
								addParticipant: _sinon2.default.spy()
							};
							participateController = new _index2.default(storage);
							_context.next = 6;
							return participateController.participate('Test', userID, {
								type: 'bandit',
								variants: variants
							});

						case 6:
							variant = _context.sent;


							_assert2.default.equal(variant, variants.A);

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		})));

		it('should reuse existing weights and call addParticipant', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
			var userID, variants, storage, participateController, variant;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							userID = 1;
							variants = {
								A: 'http://www.ff00ff.nl/',
								B: 'http://www.musketeer.ai/'
							};
							storage = {
								getTargetVariantName: function getTargetVariantName() {
									return Promise.resolve(null);
								},
								getWeights: function getWeights() {
									return Promise.resolve({
										A: 0,
										B: 1
									});
								},
								addParticipant: _sinon2.default.spy(),
								getExperiment: function getExperiment() {
									return Promise.resolve(null);
								}
							};
							participateController = new _index2.default(storage, _index4.default);
							_context2.next = 6;
							return participateController.participate('Test', userID, {
								type: 'bandit',
								variants: variants
							});

						case 6:
							variant = _context2.sent;


							_assert2.default.equal(variant, variants.B);
							_assert2.default.equal(storage.addParticipant.callCount, 1);

						case 9:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, undefined);
		})));
	});
});