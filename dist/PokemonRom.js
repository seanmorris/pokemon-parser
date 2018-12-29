'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PokemonRom = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GameboyRom2 = require('./GameboyRom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PokemonRom = exports.PokemonRom = function (_GameboyRom) {
	_inherits(PokemonRom, _GameboyRom);

	function PokemonRom(filename) {
		_classCallCheck(this, PokemonRom);

		var _this = _possibleConstructorReturn(this, (PokemonRom.__proto__ || Object.getPrototypeOf(PokemonRom)).call(this, filename));

		_this.textCodes = {
			0x4F: '  ',
			0x57: '#',
			0x51: '*',
			0x52: 'A1',
			0x53: 'A2',
			0x54: 'POKé',
			0x55: '+',
			0x58: '$',
			0x75: '…',
			0x7F: ' ',
			0x80: 'A',
			0x81: 'B',
			0x82: 'C',
			0x83: 'D',
			0x84: 'E',
			0x85: 'F',
			0x86: 'G',
			0x87: 'H',
			0x88: 'I',
			0x89: 'J',
			0x8A: 'K',
			0x8B: 'L',
			0x8C: 'M',
			0x8D: 'N',
			0x8E: 'O',
			0x8F: 'P',
			0x90: 'Q',
			0x91: 'R',
			0x92: 'S',
			0x93: 'T',
			0x94: 'U',
			0x95: 'V',
			0x96: 'W',
			0x97: 'X',
			0x98: 'Y',
			0x99: 'Z',
			0x9A: '(',
			0x9B: ')',
			0x9C: ':',
			0x9D: ';',
			0x9E: '[',
			0x9F: ']',
			0xA0: 'a',
			0xA1: 'b',
			0xA2: 'c',
			0xA3: 'd',
			0xA4: 'e',
			0xA5: 'f',
			0xA6: 'g',
			0xA7: 'h',
			0xA8: 'i',
			0xA9: 'j',
			0xAA: 'k',
			0xAB: 'l',
			0xAC: 'm',
			0xAD: 'n',
			0xAE: 'o',
			0xAF: 'p',
			0xB0: 'q',
			0xB1: 'r',
			0xB2: 's',
			0xB3: 't',
			0xB4: 'u',
			0xB5: 'v',
			0xB6: 'w',
			0xB7: 'x',
			0xB8: 'y',
			0xB9: 'z',
			0xBA: 'é',
			0xBB: '\'d',
			0xBC: '\'l',
			0xBD: '\'s',
			0xBE: '\'t',
			0xBF: '\'v',
			0xE0: '\'',
			0xE1: 'PK',
			0xE2: 'MN',
			0xE3: '-',
			0xE4: '\'r',
			0xE5: '\'m',
			0xE6: '?',
			0xE7: '!',
			0xE8: '.',
			0xED: '→',
			0xEE: '↓',
			0xEF: '♂',
			0xF0: '¥',
			0xF1: '×',
			0xF3: '/',
			0xF4: ',',
			0xF5: '♀',
			0xF6: '0',
			0xF7: '1',
			0xF8: '2',
			0xF9: '3',
			0xFA: '4',
			0xFB: '5',
			0xFC: '6',
			0xFD: '7',
			0xFE: '8',
			0xFF: '9'
		};
		return _this;
	}

	_createClass(PokemonRom, [{
		key: 'decodeText',
		value: function decodeText(buffer) {
			var text = '';
			for (var i = 0; i < buffer.length; i++) {
				if (buffer[i] in this.textCodes) {
					text += this.textCodes[buffer[i]];
				} else {
					text += '_';
				}
			}

			return text;
		}
	}, {
		key: 'pokemonName',
		value: function pokemonName(indexNumber) {
			var _this2 = this;

			return new Promise(function (accept, reject) {
				_this2.slice(0x2FA3, 1).then(function (buffer) {

					var bankByte = buffer[0];

					_this2.slice(0x2FAE, 2).then(function (buffer) {
						var pointer = 0 + bankByte * 0x4000 + (buffer[1] << 8) + (buffer[0] << 0);

						pointer -= 0x4000;

						_this2.deref(pointer + 0xA * indexNumber, 0x50, 0xA).then(function (bytes) {
							accept(_this2.decodeText(bytes));
						});
					});
				});
			});
		}
	}, {
		key: 'pokemonNumber',
		value: function pokemonNumber(indexNumber) {
			var _this3 = this;

			return new Promise(function (accept, reject) {
				_this3.slice(0x41024, 190).then(function (buffer) {
					accept(buffer[indexNumber]);
				});
			});
		}
	}, {
		key: 'pokemonInfo',
		value: function pokemonInfo(number) {
			var _this4 = this;

			return new Promise(function (accept, reject) {
				_this4.slice(0x383DE + 28 * (number - 1), 28).then(function (buffer) {
					// console.log(buffer);

					accept({
						hp: buffer[1],
						attack: buffer[2],
						defense: buffer[3],
						speed: buffer[4],
						special: buffer[5],
						type1: buffer[6],
						type2: buffer[7],
						catchRate: buffer[8],
						expYield: buffer[9],
						frontSpriteSize: buffer[10],
						frontSprite: _this4.byteVal(buffer.slice(11, 13)),
						backSprite: _this4.byteVal(buffer.slice(13, 15)),
						basiceMove1: buffer[15],
						basiceMove2: buffer[16],
						basiceMove3: buffer[17],
						basiceMove4: buffer[18]
					});
				});
			});
		}
	}, {
		key: 'listPokemon',
		value: function listPokemon() {
			var _this5 = this;

			return new Promise(function (accept, reject) {
				_this5.slice(0x41024, 190).then(function (buffer) {
					var pokemon = [];

					for (var i = 0; i < buffer.length; i++) {
						_this5.pokemonNumber(i).then(function (index) {
							return function (number) {

								_this5.pokemonName(index).then(function (index, number) {
									return function (species) {

										pokemon.push({
											number: number,
											index: index,
											species: species
										});

										if (pokemon.length == 190) {
											pokemon.sort(function (a, b) {
												return a.number - b.number;
											});

											accept(pokemon);
										}
									};
								}(index, number));
							};
						}(i));
					}
				});
			});
		}
	}, {
		key: 'pokedexEntry',
		value: function pokedexEntry(indexNumber) {
			var _this6 = this;

			return new Promise(function (accept, reject) {
				_this6.piece(0x4047E, 0x405FA).then(function (buffer) {
					var pointer = 0 + (buffer[indexNumber * 2 + 1] << 8) + (buffer[indexNumber * 2 + 0] << 0);

					pointer -= 0x4000;
					pointer += 0x40000;

					_this6.deref(pointer, 0x50).then(function (bytes) {

						var type = _this6.decodeText(bytes);

						var nextPointer = pointer + bytes.length + 1;

						if (nextPointer == 0x40fe9) {
							return;
						}

						_this6.slice(nextPointer, 9).then(function (bytes) {

							var feet = bytes[0];
							var inches = bytes[1];

							var pounds = _this6.byteVal(bytes.slice(2, 4)) / 10;

							var dexPointer = bytes[7] * 0x4000 + _this6.byteVal(bytes.slice(5, 7));

							dexPointer -= 0x4000;

							_this6.deref(dexPointer, 0x50, 512).then(function (bytes) {
								var text = _this6.decodeText(bytes);

								accept({
									type: type,
									feet: feet,
									inches: inches,
									pounds: pounds,
									text: text
								});
							});
						});
					});
				});
			});
		}
	}]);

	return PokemonRom;
}(_GameboyRom2.GameboyRom);