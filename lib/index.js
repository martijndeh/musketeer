'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _index = require('./storage/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./convert/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./participate/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./info/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./experiment-types/index.js');

var _index10 = _interopRequireDefault(_index9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MUSKETEER_STORAGE_URL = process.env.MUSKETEER_STORAGE_URL;


var storage = _index2.default.create(MUSKETEER_STORAGE_URL);
var participateController = new _index6.default(storage, _index10.default);
var convertController = new _index4.default(storage);
var infoController = new _index8.default(storage);

exports.default = {
	participate: function participate(experimentName, userID, variantValues) {
		var options = Array.isArray(variantValues) ? {
			type: 'bandit',
			variants: variantValues.reduce(function (variants, variantValue, index) {
				var variantName = String.fromCharCode(65 + index);
				variants[variantName] = variantValue;
				return variants;
			}, {})
		} : variantValues;

		(0, _assert2.default)(Object.keys(options.variants).length > 1, 'Musketeer#participate(): There should be at least two variants in experiment' + ('"' + experimentName + '", but only ' + Object.keys(options.variants).length + ' provided.'));

		(0, _assert2.default)(_index10.default[options.type], 'Musketeer#participate(): Unknown experiment type "' + options.type + '". Valid options ' + ('are: ' + Object.keys(_index10.default).join(', ') + '.'));

		return participateController.participate(experimentName, userID, options);
	},
	convert: function convert(experimentName, userID) {
		return convertController.convert(experimentName, userID);
	},
	info: function info(experimentName) {
		return infoController.info(experimentName);
	}
};