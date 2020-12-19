"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RleDelta = void 0;

var _BitArray = require("../BitArray");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RleDelta = /*#__PURE__*/function () {
  function RleDelta(input) {
    _classCallCheck(this, RleDelta);

    _defineProperty(this, "tileSize", 8);

    _defineProperty(this, "fillMode", null);

    _defineProperty(this, "lastBit", 0);

    _defineProperty(this, "deltaCount", 0);

    _defineProperty(this, "fillCount", 0);

    _defineProperty(this, "xorCount", 0);

    this.input = input;
    this.bits = new _BitArray.BitArray(input);
    this.xSize = this.bits.next(4) || 7;
    this.ySize = this.bits.next(4) || 7;
    this.sideSize = this.xSize;
    this.xSize *= this.tileSize;
    this.size = this.xSize * this.ySize;
    this.xSize = this.xSize <= 56 ? this.xSize : 56;
    this.ySize = this.ySize <= 7 ? this.ySize : 7;
    this.buffSize = Math.pow(this.sideSize, 2) * this.tileSize;
    this.buffer = new Uint8Array(this.buffSize * 2);
    this.bufferA = new Uint8Array(this.buffer.buffer, this.buffSize * 0, this.buffSize * 1);
    this.bufferB = new Uint8Array(this.buffer.buffer, this.buffSize * 1, this.buffSize * 1);
  }

  _createClass(RleDelta, [{
    key: "decompress",
    value: function decompress() {
      var buffer = this.buffer;
      var bits = this.bits;
      var xSize = this.xSize;
      var ySize = this.ySize;
      var size = this.size;
      var buffers = [new _BitArray.BitArray(this.bufferA), new _BitArray.BitArray(this.bufferB)];
      var order = bits.next();
      var bufA = buffers[order];
      var bufB = buffers[order ^ 1];
      this.fillCount = 0;
      this.fillMode = null;

      while (this.fillBuffer(bufA, bits, xSize, size)) {
        ;
      }

      var mode = bits.next();

      if (mode === 1) {
        mode = 1 + bits.next();
      }

      this.fillCount = 0;
      this.fillMode = null;

      while (this.fillBuffer(bufB, bits, xSize, size)) {
        ;
      }

      switch (mode) {
        case 0:
          this.deltaCount = 0;

          while (this.deltaFill(bufA, xSize)) {
            ;
          }

          this.deltaCount = 0;

          while (this.deltaFill(bufA, xSize)) {
            ;
          }

          break;

        case 1:
          this.deltaCount = 0;

          while (this.deltaFill(bufA, xSize)) {
            ;
          }

          this.xorCount = 0;

          while (this.xorFill(bufA, bufB)) {
            ;
          }

          break;

        case 2:
          this.deltaCount = 0;
          this.lastBit = 0;

          while (this.deltaFill(bufA, xSize)) {
            ;
          }

          this.deltaCount = 0;
          this.lastBit = 0;

          while (this.deltaFill(bufB, xSize)) {
            ;
          }

          this.xorCount = 0;

          while (this.xorFill(bufA, bufB)) {
            ;
          }

          break;
      }
    }
  }, {
    key: "tilePixelToPixel",
    value: function tilePixelToPixel(tilePixel) {// const width        = this.sideSize * this.tileSize;
      // const oddColumn    = (tilePixel % (width * 2)) >= width;
      // const column       = Math.floor(tilePixel / (width * 2));
      // const columnOffset = column * (width * 2);
      // const inColumn     = tilePixel - columnOffset;
      // const pixel = columnOffset + (oddColumn
      // 	? ((inColumn - width) * 2) + 1
      // 	: inColumn * 2
      // );
      // return pixel;
    }
  }, {
    key: "pixelToRowPixel",
    value: function pixelToRowPixel(pixel) {
      var width = this.sideSize * this.tileSize;
      var pEven = pixel % 2 === 0;
      var xOff = Math.floor(pixel / width);
      var xEven = xOff % 2 == 0;
      var yOff = pixel % width;
      var result = xOff * 2 + yOff * width + (pEven ? 0 : -(width - 1));
      return result;
    }
  }, {
    key: "xorFill",
    value: function xorFill(bitsA, bitsB) {
      if (this.xorCount >= this.buffSize * 8) {
        return false;
      }

      var bitA = bitsA.get(this.xorCount);
      var bitB = bitsB.get(this.xorCount);
      bitsB.set(this.xorCount, bitA ^ bitB);
      this.xorCount++;
      return true;
    }
  }, {
    key: "deltaFill",
    value: function deltaFill(bits, xSize) {
      if (this.deltaCount % (this.sideSize * this.tileSize) === 0) {
        this.lastBit = 0;
      }

      var pixel = this.pixelToRowPixel(this.deltaCount);
      var bit = bits.get(pixel);

      if (bit) {
        this.lastBit = 1 ^ this.lastBit;
      }

      bits.set(pixel, this.lastBit);
      this.deltaCount++;

      if (this.deltaCount < this.buffSize * 8) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "fillBuffer",
    value: function fillBuffer(buffer, bits, xSize, size) {
      var bitSize = size * 8;

      if (this.fillMode === null) {
        this.fillMode = bits.next();
      }

      if (this.fillMode === 0) {
        this.rleFill(buffer, bits);
        this.fillMode = 1;
      } else if (this.fillMode === 1) {
        this.dataFill(buffer, bits);
        this.fillMode = 0;
      }

      if (this.fillCount < bitSize) {
        return true;
      } else {
        this.fillMode = null;
        return false;
      }
    }
  }, {
    key: "rleFill",
    value: function rleFill(buffer, bits) {
      var i = 0;
      var bit = '';
      var read = '';

      while (bit = bits.next()) {
        read += bit;
        i++;
      }

      read += bit;
      var n = bits.next(i + 1);
      var x = (2 << i) - 1 + n;

      for (var j = 0; j < x; j++) {
        this.fillCount++;
        this.fillCount++;
      }
    }
  }, {
    key: "dataFill",
    value: function dataFill(buffer, bits) {
      var fill = [];

      while (true) {
        var b1 = bits.next();
        var b2 = bits.next();

        if (b1 === 0 && b2 === 0) {
          break;
        }

        fill.push(b1, b2);
        b1 && buffer.set(this.fillCount, b1);
        this.fillCount++;
        b2 && buffer.set(this.fillCount, b2);
        this.fillCount++;
      }
    }
  }]);

  return RleDelta;
}();

exports.RleDelta = RleDelta;