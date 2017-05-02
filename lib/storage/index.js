'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _index = require('./redis/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./memory/index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
	function Storage() {
		_classCallCheck(this, Storage);
	}

	_createClass(Storage, null, [{
		key: 'create',
		value: function create(connectionUrl) {
			if (!connectionUrl) {
				return new _index4.default();
			}

			var connectionObject = _url2.default.parse(connectionUrl);

			switch (connectionObject.protocol) {
				case 'redis:':
					return new _index2.default(connectionUrl);

				default:
					throw new Error('Musketeer.Storage#create(): Storage protocol "' + connectionObject.protocol + '" is unknown.');
			}
		}
	}]);

	return Storage;
}();

exports.default = Storage;