'use strict';

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('ConvertController', function () {
	it('should call addConversion', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var storage, convertController, experimentName, userID;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						storage = {
							addConversion: _sinon2.default.spy()
						};
						convertController = new _index2.default(storage);
						experimentName = 'Test';
						userID = 1;
						_context.next = 6;
						return convertController.convert(experimentName, userID);

					case 6:

						_assert2.default.equal(storage.addConversion.callCount, 1);

					case 7:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	})));
});