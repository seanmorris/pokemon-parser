import { GameboyRom } from './GameboyRom';

export class PokemonRom extends GameboyRom
{
	constructor(filename)
	{
		super(filename);

		this.textCodes = {
			0x4F: '  '
			, 0x57: '#'
			, 0x51: '*'
			, 0x52: 'A1'
			, 0x53: 'A2'
			, 0x54: 'POKé'
			, 0x55: '+'
			, 0x58: '$'
			, 0x75: '…'
			, 0x7F: ' '
			, 0x80: 'A'
			, 0x81: 'B'
			, 0x82: 'C'
			, 0x83: 'D'
			, 0x84: 'E'
			, 0x85: 'F'
			, 0x86: 'G'
			, 0x87: 'H'
			, 0x88: 'I'
			, 0x89: 'J'
			, 0x8A: 'K'
			, 0x8B: 'L'
			, 0x8C: 'M'
			, 0x8D: 'N'
			, 0x8E: 'O'
			, 0x8F: 'P'
			, 0x90: 'Q'
			, 0x91: 'R'
			, 0x92: 'S'
			, 0x93: 'T'
			, 0x94: 'U'
			, 0x95: 'V'
			, 0x96: 'W'
			, 0x97: 'X'
			, 0x98: 'Y'
			, 0x99: 'Z'
			, 0x9A: '('
			, 0x9B: ')'
			, 0x9C: ':'
			, 0x9D: ';'
			, 0x9E: '['
			, 0x9F: ']'
			, 0xA0: 'a'
			, 0xA1: 'b'
			, 0xA2: 'c'
			, 0xA3: 'd'
			, 0xA4: 'e'
			, 0xA5: 'f'
			, 0xA6: 'g'
			, 0xA7: 'h'
			, 0xA8: 'i'
			, 0xA9: 'j'
			, 0xAA: 'k'
			, 0xAB: 'l'
			, 0xAC: 'm'
			, 0xAD: 'n'
			, 0xAE: 'o'
			, 0xAF: 'p'
			, 0xB0: 'q'
			, 0xB1: 'r'
			, 0xB2: 's'
			, 0xB3: 't'
			, 0xB4: 'u'
			, 0xB5: 'v'
			, 0xB6: 'w'
			, 0xB7: 'x'
			, 0xB8: 'y'
			, 0xB9: 'z'
			, 0xBA: 'é'
			, 0xBB: '\'d'
			, 0xBC: '\'l'
			, 0xBD: '\'s'
			, 0xBE: '\'t'
			, 0xBF: '\'v'
			, 0xE0: '\''
			, 0xE1: 'PK'
			, 0xE2: 'MN'
			, 0xE3: '-'
			, 0xE4: '\'r'
			, 0xE5: '\'m'
			, 0xE6: '?'
			, 0xE7: '!'
			, 0xE8: '.'
			, 0xED: '→'
			, 0xEE: '↓'
			, 0xEF: '♂'
			, 0xF0: '¥'
			, 0xF1: '×'
			, 0xF3: '/'
			, 0xF4: ','
			, 0xF5: '♀'
			, 0xF6: '0'
			, 0xF7: '1'
			, 0xF8: '2'
			, 0xF9: '3'
			, 0xFA: '4'
			, 0xFB: '5'
			, 0xFC: '6'
			, 0xFD: '7'
			, 0xFE: '8'
			, 0xFF: '9'
		}
	}

	decodeText(buffer)
	{
		let text = '';
		for (var i = 0; i < buffer.length; i++)
		{
			if(buffer[i] in this.textCodes)
			{
				text += this.textCodes[buffer[i]];
			}
			else
			{
				text += '_';
			}
		}

		return text;
	}

	pokemonName(indexNumber)
	{
		return new Promise((accept, reject) => {
			this.slice(0x2FA3, 1).then((buffer) => {

				let bankByte = buffer[0];

				this.slice(0x2FAE, 2).then((buffer) => {
					let pointer = 0
						+ (bankByte * 0x4000)
						+ (buffer[1] << 8)
						+ (buffer[0] << 0);

					pointer -= 0x4000;

					this.deref(pointer + 0xA * indexNumber, 0x50, 0xA).then((bytes) => {
						accept(this.decodeText(bytes));
					});
				});
			});
		});
	}

	pokemonNumber(indexNumber)
	{
		return new Promise((accept, reject) => {
			this.slice(0x41024, 190).then(buffer => {
				accept(buffer[indexNumber]);
			});
		});
	}

	pokemonInfo(number)
	{
		return new Promise((accept, reject) => {
			this.slice(0x383DE + (28 * (number - 1)), 28).then(buffer => {
				// console.error(buffer);

				accept({
					hp:                buffer[1]
					, attack:          buffer[2]
					, defense:         buffer[3]
					, speed:           buffer[4]
					, special:         buffer[5]
					, type1:           buffer[6]
					, type2:           buffer[7]
					, catchRate:       buffer[8]
					, expYield:        buffer[9]
					, frontSpriteSize: buffer[10]
					, frontSprite:     this.byteVal(buffer.slice(11, 13))
					, backSprite:      this.byteVal(buffer.slice(13, 15))
					, basiceMove1:     buffer[15]
					, basiceMove2:     buffer[16]
					, basiceMove3:     buffer[17]
					, basiceMove4:     buffer[18]
				});
			});
		});
	}

	listPokemon()
	{
		return new Promise((accept, reject) => {
			this.slice(0x41024, 190).then(buffer => {
				let pokemon = [];

				for (var i = 0; i < buffer.length; i++)
				{
					this.pokemonNumber(i).then((index => number => {

						this.pokemonName(index).then(((index, number) => (species) => {

							pokemon.push({
								number
								, index
								, species
							});

							if(pokemon.length == 190)
							{
								pokemon.sort((a, b) => a.number - b.number);

								accept(pokemon);
							}

						})(index, number));

					})(i));
				}
			});
		});
	}

	pokedexEntry(indexNumber)
	{
		return new Promise((accept, reject) => {
			this.piece(0x4047E, 0x405FA).then((buffer) => {
				let pointer = 0
					+ (buffer[ indexNumber * 2+1 ] << 8)
					+ (buffer[ indexNumber * 2+0 ] << 0);

				pointer -= 0x4000;
				pointer += 0x40000;

				this.deref(pointer, 0x50).then((bytes) => {

					let type = this.decodeText(bytes);

					let nextPointer = pointer + bytes.length + 1;

					if(nextPointer == 0x40fe9)
					{
						return;
					}

					this.slice(nextPointer, 9).then((bytes) => {

						let feet   = bytes[0];
						let inches = bytes[1];

						let pounds = this.byteVal(
							bytes.slice(2, 4)
						) / 10;

						let dexPointer = (bytes[7] * 0x4000)
							+ this.byteVal(
								bytes.slice(5, 7)
							);

						dexPointer -= 0x4000;

						this.deref(dexPointer, 0x50, 512).then((bytes) => {
							let text = this.decodeText(bytes);

							accept({
								type
								, feet
								, inches
								, pounds
								, text
							});
						});
					});
				});
			});
		});
	}

	lzDecompress()
	{
		return this.piece(0x10000,0x1137F).then((buffer) => {

			console.error(buffer.length);
			const eof = 0xFF;
			const out = [];

			for (let i = 0; i < buffer.length; i += 1)
			{
				const n  = buffer[i];

				if(n === eof)
				{
					break;
				}

				let code = n >> 5;
				let c    = n & 0x1F;

				let decoded;

				const b  = buffer[i+1]
				const b2 = buffer[i+2]

				if(code === 0x7)
				{
					code = c >> 2;
					c = (c & 3) * 256 + b;
				}

				console.error('code:', code);

				decoded = [];

				let offset, direction;

				switch(code)
				{
					case 0x0:
						decoded = Array.from(buffer.slice(i+1, i+c+2));

						out.push(...decoded);

						console.error(out.length);

						i += c+3;
						break;

					case 0x1:
						decoded = Array(c+1).fill(buffer[i+1]);

						out.push(...decoded);

						console.error(out.length);

						i += 1;

						break;

					case 0x2:
						decoded = [];

						for(let ii = 0; ii < c+1; ii++)
						{
							decoded.push(ii % 2 ? b2 : b);
						}

						out.push(...decoded);

						i += 2;

						break;

					case 0x3:

						decoded = Array(c+1).fill(0x0);

						out.push(...decoded);

						break;

					case 0x5:
					case 0x6:
					case 0x4:
						// console.error(b, b2);
						offset = b;

						if(b < 0x80)
						{
							offset = (offset*256+b2) % out.length;
						}
						else
						{
							offset = b & 0x7F;
						}

						console.log(
							'CXX', code, b, b2, c+1, offset, out.length
						);

						decoded = Array(c+1).fill(0x0);

						out.push(...decoded);

						i += b < 0x80 ? 2 : 1;
						break;

					// case 0x5:
					// 	// console.error(b, b2);
					// 	offset = b;

					// 	if(b < 0x80)
					// 	{
					// 		offset = b*256+b2;
					// 	}

					// 	console.log('CXX', b, offset, out.length);

					// 	i += b < 0x80 ? 2 : 1;
					// 	break;

					// case 0x6:
					// 	// console.error(b, b2);
					// 	offset = b;

					// 	if(b < 0x80)
					// 	{
					// 		offset = b*256+b2;
					// 	}

					// 	console.log('CXX', b, offset, out.length);

					// 	i += b < 0x80 ? 2 : 1;
					// 	break;
				}

				console.error(
					"\t" + '!', (i+c+2) - (i+1)
					, decoded.length
					, '!', decoded.map(
						x=>x.toString(16).padStart(2,0)
					).join(' ')
				);

				// console.error(
				// 	`${code.toString(16).padStart(2,0)} `
				// );

			}

			console.error();
			console.error('=====================');
			console.error(out.length);
			console.error(out.join(' '));

			process.stdout.write(ArrayBuffer.from(out));

			// out.forEach(b => {
				
			// })
		});
	}
}
