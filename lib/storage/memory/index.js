'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstract = require('../abstract.js');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MemoryStorage = function (_Storage) {
	_inherits(MemoryStorage, _Storage);

	function MemoryStorage() {
		_classCallCheck(this, MemoryStorage);

		var _this = _possibleConstructorReturn(this, (MemoryStorage.__proto__ || Object.getPrototypeOf(MemoryStorage)).call(this));

		var _process$env = process.env,
		    NODE_ENV = _process$env.NODE_ENV,
		    MUSKETEER_MEMORY_STORAGE_WARNING = _process$env.MUSKETEER_MEMORY_STORAGE_WARNING;


		if (NODE_ENV === 'production' && MUSKETEER_MEMORY_STORAGE_WARNING !== 'false') {
			/* eslint-disable no-console */
			console.log('Warning: Musketeer is using the memory storage which should not be used' + 'in production. If you know what you\'re doing, and you insist on using the' + 'memory storage, please set MUSKETEER_MEMORY_STORAGE_WARNING to false.');
			/* eslint-enable no-console */
		}

		_this.state = {};
		return _this;
	}

	_createClass(MemoryStorage, [{
		key: 'getTargetVariantName',
		value: function getTargetVariantName(experimentName, userID) {
			var participants = this.state['participants.' + experimentName] || {};
			return Promise.resolve(participants[userID]);
		}
	}, {
		key: 'getWeights',
		value: function getWeights(experimentName) {
			return Promise.resolve(this.state['weights.' + experimentName]);
		}
	}, {
		key: 'saveWeights',
		value: function saveWeights(experimentName, weights, expiry) {
			var _this2 = this;

			this.state['weights.' + experimentName] = weights;

			var timer = setTimeout(function () {
				delete _this2.state['weights.' + experimentName];
			}, expiry * 1000);

			// We do not want to keep the event loop alive because of this timer.
			timer.unref();

			return Promise.resolve();
		}
	}, {
		key: 'getExperiment',
		value: function getExperiment(name) {
			return Promise.resolve(this.state['experiments.' + name]);
		}
	}, {
		key: 'addParticipant',
		value: function addParticipant(experimentName, targetVariantName, userID) {
			var participants = this.state['participants.' + experimentName] || {};

			if (!participants[userID]) {
				participants[userID] = targetVariantName;

				var experiments = this.state['experiments.' + experimentName] || {};
				experiments[targetVariantName + '.participants'] += 1;
			}

			return Promise.resolve();
		}
	}, {
		key: 'addConversion',
		value: function addConversion(experimentName, userID) {
			var targetVariantName = this.getTargetVariantName(experimentName, userID);

			if (targetVariantName) {
				var conversions = this.state['conversions.' + experimentName] || {};
				if (!conversions[userID]) {
					conversions[userID] = targetVariantName;

					var experiments = this.state['experiments.' + experimentName] || {};
					experiments[targetVariantName + '.conversions'] += 1;
					return Promise.resolve(true);
				}
			}

			return Promise.resolve(false);
		}
	}]);

	return MemoryStorage;
}(_abstract2.default);

exports.default = MemoryStorage;