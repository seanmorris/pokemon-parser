'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Rom = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rom = exports.Rom = function () {
	function Rom(filename) {
		_classCallCheck(this, Rom);

		this.filename = filename;
		this.buffer = null;
		this.index = {};
		this.segments = {};
		this.ordered = false;
	}

	_createClass(Rom, [{
		key: 'preload',
		value: function preload() {
			var _this = this;

			return new Promise(function (accept, reject) {
				_fs2.default.exists(_this.filename, function (exists) {
					if (!exists) {
						return reject('Rom file does not exist.');
					}

					_fs2.default.stat(_this.filename, function (error, stats) {
						if (error) {
							return reject(error);
						}

						_fs2.default.open(_this.filename, 'r', function (error, handle) {
							if (error) {
								return reject(error);
							}

							_fs2.default.read(handle, Buffer.alloc(stats.size), null, stats.size, 0, function (error, bytesRead, buffer) {
								if (error) {
									return reject(error);
								}

								_this.buffer = buffer;

								accept(buffer);
							});
						});
					});
				});
			});
		}
	}, {
		key: 'slice',
		value: function slice(start, length) {
			var _this2 = this;

			return new Promise(function (accept, reject) {
				if (_this2.buffer) {
					accept(_this2.buffer.slice(start, start + length));
				}

				_fs2.default.exists(_this2.filename, function (exists) {
					if (!exists) {
						return reject('Rom file does not exist.');
					}

					_fs2.default.open(_this2.filename, 'r', function (error, handle) {

						if (error) {
							return reject(error);
						}

						_fs2.default.read(handle, Buffer.alloc(length), null, length, start, function (error, bytesRead, buffer) {
							if (error) {
								return reject(error);
							}

							accept(buffer);
						});
					});
				});
			});
		}
	}, {
		key: 'piece',
		value: function piece(start, end) {
			return this.slice(start, end - start);
		}
	}, {
		key: 'deref',
		value: function deref(start, terminator, max) {
			var _this3 = this;

			return new Promise(function (accept, reject) {
				var bytes = [];

				var consume = function consume(start, bytes, accept, reject) {
					_this3.slice(start, 16).then(function (buffer) {
						for (var i = 0; i < buffer.length; i += 1) {
							if (buffer[i] === terminator || bytes.length >= max) {
								return accept(Buffer.from(bytes));
							} else {
								bytes.push(buffer[i]);
							}
						}

						consume(start + 16, bytes, accept, reject);
					});
				};

				consume(start, [], accept, reject);
			});
		}
	}, {
		key: 'byteVal',
		value: function byteVal(buffer) {
			var val = 0;

			for (var i = 0; i < buffer.length; i += 1) {
				val += buffer[i] << 8 * i;
			}

			return val;
		}
	}, {
		key: 'indexSegments',
		value: function indexSegments() {
			var segments = [];

			for (var i in this.index) {
				segments.push({
					position: this.index[i],
					title: i
				});
			}

			segments.sort(function (a, b) {
				return b.position - a.position;
			});

			var lastSegment = null;

			for (var _i in segments) {
				if (!lastSegment) {
					segments[_i].length = 0;
				} else {
					segments[_i].length = lastSegment.position - segments[_i].position;
				}

				lastSegment = segments[_i];
			}

			for (var _i2 in segments) {
				this.segments[segments[_i2].title] = segments[_i2];
			}
		}
	}, {
		key: 'segment',
		value: function segment(name) {
			var _this4 = this;

			this.indexSegments();

			if (name in this.segments) {
				if (!this.segments[name].length) {
					return new Promise(function (accept, reject) {
						_this4.preload().then(function (buffer) {
							_this4.segments[name].length = buffer.length - _this4.segments[name].position;

							accept(_this4.slice(_this4.segments[name].position, _this4.segments[name].length));
						});
					});
				}

				return this.slice(this.segments[name].position, this.segments[name].length);
			}
		}
	}]);

	return Rom;
}();