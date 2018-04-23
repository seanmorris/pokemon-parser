import fs from 'fs';

class Rom
{
	constructor(filename)
	{
		this.filename = filename;
		this.buffer   = null;
		this.index    = {};
		this.segments = {};
		this.ordered  = false;
	}

	preload()
	{
		return new Promise((accept, reject) => {
			fs.exists(this.filename, (exists) => {
				if(!exists)
				{
					return reject('Rom file does not exist.');
				}

				fs.stat(this.filename, (error, stats) => {
					if(error)
					{
						return reject(error);
					}

					fs.open(this.filename, 'r', (error, handle) => {
						if(error)
						{
							return reject(error);
						}

						fs.read(
							handle
							, Buffer.alloc(stats.size)
							, null
							, stats.size
							, 0
							, (error, bytesRead, buffer) => {
								if(error)
								{
									return reject(error);
								}

								this.buffer = buffer;

								accept(buffer);
							}
						);
					});
				});
			});
		});
	}

	slice(start, length)
	{
		return new Promise((accept, reject) => {
			if(this.buffer)
			{
				accept(this.buffer.slice(start, start + length));
			}

			fs.exists(this.filename, (exists) => {
				if(!exists)
				{
					return reject('Rom file does not exist.');
				}

				fs.open(this.filename, 'r', (error, handle) => {

					if(error)
					{
						return reject(error);
					}

					fs.read(
						handle
						, Buffer.alloc(length)
						, null
						, length
						, start
						, (error, bytesRead, buffer) => {
							if(error)
							{
								return reject(error);
							}

							accept(buffer);
						}
					);
				});
			});
		});
	}

	piece(start, end)
	{
		return this.slice(start, (end - start));
	}

	deref(start, terminator, max)
	{
		return new Promise((accept, reject) => {
			let bytes = [];

			let consume = (start, bytes, accept, reject) => {
				this.slice(start, 16).then((buffer) => {
					for (let i = 0; i < buffer.length; i += 1)
					{
						if(buffer[i] === terminator || bytes.length >= max)
						{
							return accept(Buffer.from(bytes));
						}
						else
						{
							bytes.push(buffer[i]);
						}
					}

					consume(start + 16, bytes, accept, reject);
				});
			};

			consume(start, [], accept, reject);
		});
	}

	byteVal(buffer)
	{
		let val = 0;

		for (let i = 0; i < buffer.length; i += 1)
		{
			val += ( buffer[i] << 8*i );
		}

		return val;
	}

	indexSegments()
	{
		let segments = [];

		for(let i in this.index)
		{
			segments.push({
				position: this.index[i]
				, title:  i
			});
		}

		segments.sort((a, b) => {
			return b.position - a.position
		});

		let lastSegment = null;

		for(let i in segments)
		{
			if(!lastSegment)
			{
				segments[i].length = 0;
			}
			else
			{
				segments[i].length = lastSegment.position - segments[i].position;
			}

			lastSegment = segments[i];
		}

		for(let i in segments)
		{
			this.segments[segments[i].title] = segments[i];
		}
	}

	segment(name)
	{
		this.indexSegments();

		if(name in this.segments)
		{
			if(!this.segments[name].length)
			{
				return new Promise((accept, reject) => {
					this.preload().then((buffer) => {
						this.segments[name].length =
							buffer.length
							- this.segments[name].position

						accept(this.slice(
							this.segments[name].position
							, this.segments[name].length
						));
					});
				});

			}

			return this.slice(
				this.segments[name].position
				, this.segments[name].length
			);
		}
	}
}

class GameboyRom extends Rom
{
	constructor(filename)
	{
		super(filename);

		this.index = {
			blank:          0x0
			, entryPoint:   0x100
			, nintendoLogo: 0x104
			, title:        0x134
			, manufacturer: 0x13F
			, colorGameboy: 0x143
			, licensee:     0x144
			, superGameboy: 0x146
			, cartrigeType: 0x147
			, romSize:      0x148
			, ramSize:      0x149
			, destination:  0x14A
			, licensee:     0x14B
			, romVersion:   0x14C
			, headerCheck:  0x14D
			, globalCheck:  0x14E
			, _:            0x150
		};
	}
}

class PokemonRom extends GameboyRom
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
			rom.slice(0x41024, 190).then(buffer => {
				accept(buffer[indexNumber]);
			});
		});
	}

	pokemonInfo(number)
	{
		return new Promise((accept, reject) => {
			rom.slice(0x383DE + (28 * (number - 1)), 28).then(buffer => {
				// console.log(buffer);

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
			rom.slice(0x41024, 190).then(buffer => {
				let pokemon = [];

				for (var i = 0; i < buffer.length; i++)
				{
					rom.pokemonNumber(i).then((index => number => {

						rom.pokemonName(index).then(((index, number) => (species) => {

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

				rom.deref(pointer, 0x50).then((bytes) => {

					let type = rom.decodeText(bytes);

					let nextPointer = pointer + bytes.length + 1;

					if(nextPointer == 0x40fe9)
					{
						return;
					}

					rom.slice(nextPointer, 9).then((bytes) => {

						let feet   = bytes[0];
						let inches = bytes[1];

						let pounds = rom.byteVal(
							bytes.slice(2, 4)
						) / 10;

						let dexPointer = (bytes[7] * 0x4000)
							+ rom.byteVal(
								bytes.slice(5, 7)
							);

						dexPointer -= 0x4000;

						rom.deref(dexPointer, 0x50, 512).then((bytes) => {
							let text = rom.decodeText(bytes);

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
}

let rom = new PokemonRom('/home/sean/PokemonRed.gb');

rom.preload().then((buffer)=>{

	// // title

	// rom.segment('title').then((buffer) => {
	// 	console.log(buffer.toString());
	// });

	// // elements

	// rom.piece(0x27DE4, 0x27E49).then((buffer) => {
	// 	console.log( rom.decodeText(buffer) );
	// });

	rom.listPokemon().then(pokemon => {
		let pokemonPromises = pokemon.map(pokemon => {
			if(!pokemon.number)
			{
				return Promise.resolve(false);
				// return Promise.resolve({
				// 	type:    'UNKNOWN'
				// 	, feet:   0
				// 	, inches: 0
				// 	, pounds: 0
				// 	, text:   '???'
				// });
			}

			return new Promise((accept, reject) => {
				rom.pokemonName(pokemon.index).then((name) => {
				
					rom.pokedexEntry(pokemon.index).then((entry) => {
						pokemon.entry = entry;

						rom.pokemonInfo(pokemon.number).then((info) => {
							pokemon.info = info;

							accept(pokemon);
						});
					});
				});
			});
		});

		Promise.all(pokemonPromises).then(pokemon => {
			for(let i in pokemon)
			{
				if(!pokemon[i])
				{
					continue;
				}

				console.log(
					`#${pokemon[i].number.toFixed(0).padStart(3, '0')} ${pokemon[i].species} - ${pokemon[i].entry.type}
	Height: ${pokemon[i].entry.feet}' ${pokemon[i].entry.inches}"
	Weight: ${pokemon[i].entry.pounds} lbs
	${pokemon[i].entry.text.replace(/(^_|_$)/g, '')
		.replace(/_/g, ' ')
		+ '.'
	}

	HP:      ${pokemon[i].info.hp}
	Attack:  ${pokemon[i].info.attack}
	Defense: ${pokemon[i].info.defense}
	Speed:   ${pokemon[i].info.speed}
	Special: ${pokemon[i].info.special}
	
	Type 1:  ${pokemon[i].info.type1}
	Type 2:  ${pokemon[i].info.type2}

	Base Experience Yield: ${pokemon[i].info.expYield}

	Size of Front Sprite: ${pokemon[i].info.frontSpriteSize}
	
	Front Sprite: 0x${pokemon[i].info.frontSprite.toString(16)}
	Back Sprite:  0x${pokemon[i].info.backSprite.toString(16)}

	Basic Move 1: ${pokemon[i].info.basiceMove1}
	Basic Move 2: ${pokemon[i].info.basiceMove2}
	Basic Move 3: ${pokemon[i].info.basiceMove3}
	Basic Move 4: ${pokemon[i].info.basiceMove4}
`
				);
			}
		})
	});
});
