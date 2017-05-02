'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstract = require('../abstract.js');

var _abstract2 = _interopRequireDefault(_abstract);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

var RedisStorage = function (_Storage) {
	_inherits(RedisStorage, _Storage);

	function RedisStorage(connectionUrl) {
		_classCallCheck(this, RedisStorage);

		var _this = _possibleConstructorReturn(this, (RedisStorage.__proto__ || Object.getPrototypeOf(RedisStorage)).call(this));

		_this.client = _redis2.default.createClient(connectionUrl);
		return _this;
	}

	_createClass(RedisStorage, [{
		key: 'getTargetVariantName',
		value: function getTargetVariantName(experimentName, userID) {
			return this.client.hgetAsync('participants.' + experimentName, userID);
		}
	}, {
		key: 'getWeights',
		value: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(experimentName) {
				var weightsAsStrings, variantNames;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.client.hgetallAsync('weights.' + experimentName);

							case 2:
								weightsAsStrings = _context.sent;

								if (!weightsAsStrings) {
									_context.next = 6;
									break;
								}

								variantNames = Object.keys(weightsAsStrings);
								return _context.abrupt('return', variantNames.reduce(function (weights, variantName) {
									weights[variantName] = parseFloat(weightsAsStrings[variantName]);
									return weights;
								}, {}));

							case 6:
								return _context.abrupt('return', null);

							case 7:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function getWeights(_x) {
				return _ref.apply(this, arguments);
			}

			return getWeights;
		}()
	}, {
		key: 'saveWeights',
		value: function saveWeights(experimentName, weights, expiry) {
			// TODO: If expiry is 0, we can just set the key and call it a day.

			return this.client.multi().hmset('weights.' + experimentName, weights).expire('weights.' + experimentName, expiry).execAsync();
		}
	}, {
		key: 'getExperiment',
		value: function getExperiment(name) {
			return this.client.hgetallAsync('experiments.' + name);
		}
	}, {
		key: 'addParticipant',
		value: function () {
			var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(experimentName, targetVariantName, userID) {
				var result;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.client.hsetnxAsync('participants.' + experimentName, userID, targetVariantName);

							case 2:
								result = _context2.sent;

								if (!(result === 1)) {
									_context2.next = 6;
									break;
								}

								_context2.next = 6;
								return this.client.hincrbyAsync('experiments.' + experimentName, targetVariantName + '.participants', 1);

							case 6:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function addParticipant(_x2, _x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return addParticipant;
		}()
	}, {
		key: 'addConversion',
		value: function () {
			var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(experimentName, userID) {
				var targetVariantName, result;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.getTargetVariantName(experimentName, userID);

							case 2:
								targetVariantName = _context3.sent;

								if (!targetVariantName) {
									_context3.next = 11;
									break;
								}

								_context3.next = 6;
								return this.client.hsetnxAsync('conversions.' + experimentName, userID, targetVariantName);

							case 6:
								result = _context3.sent;

								if (!(result === 1)) {
									_context3.next = 11;
									break;
								}

								_context3.next = 10;
								return this.client.hincrbyAsync('experiments.' + experimentName, targetVariantName + '.conversions', 1);

							case 10:
								return _context3.abrupt('return', true);

							case 11:
								return _context3.abrupt('return', false);

							case 12:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function addConversion(_x5, _x6) {
				return _ref3.apply(this, arguments);
			}

			return addConversion;
		}()
	}]);

	return RedisStorage;
}(_abstract2.default);

exports.default = RedisStorage;