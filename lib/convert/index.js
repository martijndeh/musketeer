"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConvertController = function () {
	function ConvertController(storage) {
		_classCallCheck(this, ConvertController);

		this.storage = storage;
	}

	_createClass(ConvertController, [{
		key: "convert",
		value: function convert(experimentName, userID) {
			return this.storage.addConversion(experimentName, userID);
		}
	}]);

	return ConvertController;
}();

exports.default = ConvertController;