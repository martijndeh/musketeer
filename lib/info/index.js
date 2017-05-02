'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InfoController = function () {
	function InfoController(storage) {
		_classCallCheck(this, InfoController);

		this.storage = storage;
	}

	_createClass(InfoController, [{
		key: 'info',
		value: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(experimentName) {
				var experiment, variants;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.storage.getExperiment(experimentName);

							case 2:
								_context.t0 = _context.sent;

								if (_context.t0) {
									_context.next = 5;
									break;
								}

								_context.t0 = {};

							case 5:
								experiment = _context.t0;
								variants = Object.keys(experiment).reduce(function (variants, key) {
									var count = parseInt(experiment[key], 10);

									var _key$split = key.split('.'),
									    _key$split2 = _slicedToArray(_key$split, 2),
									    variantName = _key$split2[0],
									    type = _key$split2[1];

									if (!variants[variantName]) {
										variants[variantName] = {};
									}

									var variant = variants[variantName];
									variant[type] = count;
									return variants;
								}, {});


								Object.keys(variants).forEach(function (variantName) {
									var variant = variants[variantName];

									if (variant.participants > 0) {
										variant.conversionRate = variant.conversions / variant.participants;
									}
								});

								return _context.abrupt('return', {
									name: experimentName,
									variants: variants
								});

							case 9:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function info(_x) {
				return _ref.apply(this, arguments);
			}

			return info;
		}()
	}]);

	return InfoController;
}();

exports.default = InfoController;