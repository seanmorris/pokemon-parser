"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Merge = void 0;

var _BitArray = require("../BitArray");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Merge = /*#__PURE__*/function () {
  function Merge(input, width) {
    _classCallCheck(this, Merge);

    this.width = width;
    this.size = input.length;
    this.input = new _BitArray.BitArray(input);
    this.buffer = new Uint8Array(Math.pow(width, 2));
  }

  _createClass(Merge, [{
    key: "decompress",
    value: function decompress() {
      var pallet = [255, 128, 196, 64];
      var halfLength = this.input.length / 2;

      for (var i = 0; i < halfLength; i++) {
        var b1 = this.input.get(this.pixelToRowPixel(i));
        var b2 = this.input.get(this.pixelToRowPixel(i) + Math.pow(this.width, 2));
        var b = b1 << 1 | b2;
        this.buffer[i] = pallet[b];
      }
    }
  }, {
    key: "pixelToRowPixel",
    value: function pixelToRowPixel(pixel) {
      var width = this.width;
      var pEven = pixel % 2 === 0;
      var xOff = Math.floor(pixel / width);
      var xEven = xOff % 2 == 0;
      var yOff = pixel % width;
      var result = xOff * 2 + yOff * width + (pEven ? 0 : -(width - 1));
      return result;
    }
  }]);

  return Merge;
}();

exports.Merge = Merge;