"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-mixed-operators */
function rbeta(a, b) {
	var sum = a + b;
	var ratio = a / b;
	var min = Math.min(a, b);

	var y = 0;
	var lhs = 0;
	var rhs = 0;

	var lambda = min <= 1 ? min : Math.sqrt((2 * a * b - a - b) / (sum - 2));

	do {
		var r1 = Math.random();
		var r2 = Math.random();

		y = Math.pow(1 / r1 - 1, 1 / lambda);

		lhs = 4 * r1 * r2 * r2;
		rhs = Math.pow(y, a - lambda) * Math.pow((1 + ratio) / (1 + ratio * y), sum);
	} while (lhs >= rhs);

	return ratio * y / (1 + ratio * y);
}
/* eslint-enable no-mixed-operators */

function getRandomVariantName(experiment, variantNames) {
	var targetIndex = 0;
	var maxScore = 0;

	variantNames.forEach(function (variantName, index) {
		var participants = parseInt(experiment[variantName + ".participants"], 10) || 0;
		var conversions = parseInt(experiment[variantName + ".conversions"], 10) || 0;

		var score = rbeta(1 + conversions, 1 + participants - conversions);

		if (score > maxScore) {
			maxScore = score;
			targetIndex = index;
		}
	});

	return variantNames[targetIndex];
}

var BanditExperimentType = function () {
	function BanditExperimentType() {
		_classCallCheck(this, BanditExperimentType);
	}

	_createClass(BanditExperimentType, null, [{
		key: "calculateWeights",
		value: function calculateWeights(experiment, variants) {
			var variantNames = Object.keys(variants);
			var weights = variantNames.reduce(function (weights, variantName) {
				weights[variantName] = 0;
				return weights;
			}, {});

			// TODO: Replace the below with some sane calculations, instead of a brute force search.
			var max = 500;
			for (var i = 0; i < max; i += 1) {
				var variantName = getRandomVariantName(experiment, variantNames);
				weights[variantName] += 1 / max;
			}

			return weights;
		}
	}]);

	return BanditExperimentType;
}();

BanditExperimentType.expiry = 15;
exports.default = BanditExperimentType;