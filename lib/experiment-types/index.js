'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bandit = require('./bandit.js');

var _bandit2 = _interopRequireDefault(_bandit);

var _random = require('./random.js');

var _random2 = _interopRequireDefault(_random);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	random: _random2.default,
	bandit: _bandit2.default
};