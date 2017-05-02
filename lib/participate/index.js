"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticipateController = function () {
	function ParticipateController(storage, experimentTypes) {
		_classCallCheck(this, ParticipateController);

		this.storage = storage;
		this.experimentTypes = experimentTypes;
	}

	/**
  * Calculate a random variant based on the weight per variant.
  *
  * @param {Object} weights A hash with variant names and weights.
  * @returns {String} A random variant name e.g. A or B.
  **/


	_createClass(ParticipateController, [{
		key: "getRandomVariantName",
		value: function getRandomVariantName(weights) {
			var variantNames = Object.keys(weights);
			var totalWeight = variantNames.reduce(function (weight, variantName) {
				return weight + weights[variantName];
			}, 0);

			// Math.random() returns a number from 0 (inclusive) up to but not including 1 (exclusive).
			// So random is 0 (inclusive) up to totalWeight (exclusive).
			var random = Math.random() * totalWeight;

			var weight = 0;

			for (var i = 0; i < variantNames.length; i += 1) {
				var variantName = variantNames[i];
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

	}, {
		key: "createEmptyExperiment",
		value: function createEmptyExperiment(variantNames) {
			return variantNames.reduce(function (experiment, variantName) {
				var _extends2;

				return _extends({}, experiment, (_extends2 = {}, _defineProperty(_extends2, variantName + ".participants", 0), _defineProperty(_extends2, variantName + ".conversions", 0), _extends2));
			}, {});
		}
	}, {
		key: "participate",
		value: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(experimentName, userID, options) {
				var variants, targetVariantName, experimentType, weights, experiment, randomVariantName;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								// TODO: Should we create the experiment so we know the start date. Or should we start the
								// experiment when the first conversion is created?
								variants = options.variants;
								_context.next = 3;
								return this.storage.getTargetVariantName(experimentName, userID);

							case 3:
								targetVariantName = _context.sent;

								if (!targetVariantName) {
									_context.next = 6;
									break;
								}

								return _context.abrupt("return", variants[targetVariantName]);

							case 6:
								experimentType = this.experimentTypes[options.type];
								_context.next = 9;
								return this.storage.getWeights(experimentName);

							case 9:
								weights = _context.sent;

								if (weights) {
									_context.next = 20;
									break;
								}

								_context.next = 13;
								return this.storage.getExperiment(experimentName);

							case 13:
								_context.t0 = _context.sent;

								if (_context.t0) {
									_context.next = 16;
									break;
								}

								_context.t0 = this.createEmptyExperiment(Object.keys(variants));

							case 16:
								experiment = _context.t0;

								weights = experimentType.calculateWeights(experiment, variants);

								_context.next = 20;
								return this.storage.saveWeights(experimentName, weights, options.expiry || experimentType.expiry);

							case 20:
								randomVariantName = this.getRandomVariantName(weights);
								_context.next = 23;
								return this.storage.addParticipant(experimentName, randomVariantName, userID);

							case 23:
								return _context.abrupt("return", variants[randomVariantName]);

							case 24:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function participate(_x, _x2, _x3) {
				return _ref.apply(this, arguments);
			}

			return participate;
		}()
	}]);

	return ParticipateController;
}();

exports.default = ParticipateController;