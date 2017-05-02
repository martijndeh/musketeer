"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
	function Storage() {
		_classCallCheck(this, Storage);
	}

	_createClass(Storage, [{
		key: "getTargetVariantName",
		value: function getTargetVariantName(experimentName, userID) {
			//
		}
	}, {
		key: "getWeights",
		value: function getWeights(experimentName) {
			//
		}
	}, {
		key: "saveWeights",
		value: function saveWeights(experimentName, weights, expiry) {
			//
		}
	}, {
		key: "getExperiment",
		value: function getExperiment(name) {
			//
		}
	}, {
		key: "addParticipant",
		value: function addParticipant(experimentName, targetVariantName, userID) {
			//
		}
	}, {
		key: "addConversion",
		value: function addConversion(experimentName, userID) {
			//
		}
	}]);

	return Storage;
}();

exports.default = Storage;