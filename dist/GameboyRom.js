'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GameboyRom = undefined;

var _Rom2 = require('./Rom');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameboyRom = exports.GameboyRom = function (_Rom) {
	_inherits(GameboyRom, _Rom);

	function GameboyRom(filename) {
		var _this$index;

		_classCallCheck(this, GameboyRom);

		var _this = _possibleConstructorReturn(this, (GameboyRom.__proto__ || Object.getPrototypeOf(GameboyRom)).call(this, filename));

		_this.index = (_this$index = {
			blank: 0x0,
			entryPoint: 0x100,
			nintendoLogo: 0x104,
			title: 0x134,
			manufacturer: 0x13F,
			colorGameboy: 0x143,
			licensee: 0x144,
			superGameboy: 0x146,
			cartrigeType: 0x147,
			romSize: 0x148,
			ramSize: 0x149,
			destination: 0x14A
		}, _defineProperty(_this$index, 'licensee', 0x14B), _defineProperty(_this$index, 'romVersion', 0x14C), _defineProperty(_this$index, 'headerCheck', 0x14D), _defineProperty(_this$index, 'globalCheck', 0x14E), _defineProperty(_this$index, '_', 0x150), _this$index);
		return _this;
	}

	return GameboyRom;
}(_Rom2.Rom);