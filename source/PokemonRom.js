import { BitArray   }  from './BitArray';
import { Rom }         from './gameboy/Rom';

import { Gameboy2bpp } from './decompress/Gameboy2bpp';
import { RleDelta }    from './decompress/RleDelta';
import { Merge }       from './decompress/Merge';

export class PokemonRom extends Rom
{
	constructor(filename, isYellow = false)
	{
		super(filename);

		this.offsets = {};

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

	preload(buffer)
	{
		const preload = super.preload(buffer);

		preload.then(() => {

			if(this.title === 'POKEMON YELLOW')
			{
				this.offsets = {
					dexOrder: 0x410B1,
					dexStart: 0x4050b,
					dexEnd:   0x4050b + 380,

					typesStart: 0x27D99,
					typesEnd:   0x27DFE,

					movesStart: 0xBC000,
					movesEnd:   0xBC60F,

					namesStart: 0xE8000,

					levelUp: 0x3B1E5,

					palletPointers: 0x72922,
					palletStart:    0x729b9,
					palletEnd:      0x7358f,

					overworldAStart: 0x12365,
					overworldAEnd:   0x13765,

					overworldBStart: 0x143F1,
					overworldBEnd:   0x17C31,

					overworldCStart: 0x411E5,
					overworldCEnd:   0x413E5,

					overworldDStart: 0xE91B,
					overworldDEnd:   0xED1B,

					overworldEStart: 0x78237,
					overworldEEnd:   0x78D97,

					overworldFStart: 0xFE66F,
					overworldFEnd:   0xFF26F,

					titleScreenExtraA: 0xF470B,
					titleScreenExtraB: 0xFA36A,

					tilesetStart: 0xC558,
					tilesetEnd:   0xC678,

					mapAStart: 0xFC1F2,
					mapAEnd:   0xFC2EA,

					mapBStart: 0xFC3E4,
					mapBEnd:   0xFC3E4+248,

					tmStart: 0x1232D,
					tmEnd:   0x1232D + 55,
				};
			}
			else if(this.title === 'POKEMON RED' || this.title === 'POKEMON BLUE')
			{
				this.offsets = {
					dexOrder: 0x41024,
					dexStart: 0x4047E,
					dexEnd:   0x405FA,

					typesStart: 0x27DE4,
					typesEnd:   0x27E49,

					movesStart: 0xB0000,
					movesEnd:   0xB060E,

					namesStart: 0x1c21e,

					levelUp: 0x3B05C,

					palletPointers: 0x725C9,
					palletStart:    0x72660,
					palletEnd:      0x7278F,

					overworldAStart: 0x10000,
					overworldAEnd:   0x11380,

					overworldBStart: 0x14000,
					overworldBEnd:   0x17840,

					overworldCStart: 0x17CBD,
					overworldCEnd:   0x17D7D,

					overworldDStart: 0xEA9E,
					overworldDEnd:   0xEE9E,

					overworldEStart: 0x781FE,
					overworldEEnd:   0x78D3E,

					tilesetStart: 0xC7BE,
					tilesetEnd:   0xC8DE,

					mapAStart: 0x01AE,
					mapAEnd:   0x039E,

					mapBStart: 0xC23D,
					mapBEnd:   0xC335,

					tmStart: 0x13773,
					tmEnd:   0x137AA,
				};
			}

		});

		return preload;
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
				text += ' ';
			}
		}

		return text.trim();
	}

	getAllTypes()
	{
		return this.types = this.types || this
		.piece(this.offsets.typesStart, this.offsets.typesEnd)
		.then((buffer) => this.decodeText(buffer).split(' '));
	}

	getAllMoves()
	{
		return this.moves = this.moves || this
		.piece(this.offsets.movesStart, this.offsets.movesEnd)
		.then((buffer) => {

			const nameBytes = [];
			const nameList  = [];

			for(let i in buffer)
			{
				const byte = buffer[i];

				if(byte === 80)
				{
					const name = this.decodeText( nameBytes.splice(0) );

					nameList.push(name);

					continue;
				}

				nameBytes.push(buffer[i]);
			}

			const name = this.decodeText( nameBytes.splice(0) );

			nameList.push(name);

			return nameList;
		});
	}

	getTmMoves()
	{
		if(this.tmMoves) return this.tmMoves;
		return this.tmMoves = Promise.all([this.piece(this.offsets.tmStart, this.offsets.tmEnd), this.getAllMoves()])
		.then(([buffer,moves]) => [...buffer].map(x => ({moveId: x, move: moves[-1 + x]})));
	}

	getAllNumbers()
	{
		return this.numbers = this.numbers = this.slice(this.offsets.dexOrder, 190);
	}

	getAllIndexNumbers()
	{
		if(!this.indexNumbers)
		{
			this.indexNumbers = [];
		}
		else
		{
			return this.indexNumbers;
		}

		return this.getAllNumbers().then(numbers => {

			for(const i in numbers)
			{
				this.indexNumbers[ numbers[i] ] = i;
			}

			return this.indexNumbers;
		});
	}

	getSprites()
	{
		const getChunks = [
			  this.piece(this.offsets.overworldAStart, this.offsets.overworldAEnd)
			, this.piece(this.offsets.overworldBStart, this.offsets.overworldBEnd)
			, this.piece(this.offsets.overworldCStart, this.offsets.overworldCEnd)
			, this.piece(this.offsets.overworldDStart, this.offsets.overworldDEnd)
			, this.piece(this.offsets.overworldEStart, this.offsets.overworldEEnd)
		];

		if(this.offsets.overworldFStart)
		{
			getChunks.push( this.piece(this.offsets.overworldFStart, this.offsets.overworldFEnd) );
		}

		return Promise.all(getChunks).then(chunks => chunks.map(chunk => {

			const sprites = new Uint8Array(chunk.length * 32);
			const decoder = new Gameboy2bpp(chunk, sprites, 16);

			while(decoder.next()){}

			return sprites
		}));
	}

	getBlockFromSet(address, blockId)
	{
		return this.buffer.slice(
			address + (0+blockId) * 16
			, address + (1+blockId) * 16
		);
	}

	getAllTilesets()
	{
		return this.piece(this.offsets.tilesetStart, this.offsets.tilesetEnd).then(headers => {

			const tilesets = [];

			for(let c = 0; c < 24; c++)
			{
				const header = headers.slice((0+c) * 12, (1+c) * 12);

				const bank = header[0];

				const blockPointer     = this.makeRef(bank, header.slice(1,3));
				const tilePointer      = this.makeRef(bank, header.slice(3,5));
				const collisionPointer = this.makeRef(0, header.slice(5,7));

				const talkTiles = header.slice(7,10);
				const grass     = header[10];
				const animation = header[11];

				tilesets.push({
					tilePointer
					, blockPointer
					, collisionPointer
					, grass
					, animation
				});
			}

			return tilesets;
		});
	}

	getAllMaps()
	{
		const pieces = [ this.piece(this.offsets.mapAStart, this.offsets.mapAEnd), this.piece(this.offsets.mapBStart, this.offsets.mapBEnd)];

		return Promise.all(pieces).then(([offsets, banks]) => {

			const mapPointers = [];

			for(const i in banks)
			{
				const bank    = banks[i];
				const offset  = offsets.slice(i*2, i*2 + 2);

				const pointer = this.makeRef(bank, offset);

				mapPointers.push([bank, pointer, i]);
			}

			const maps = [];

			for(const [bank, mapPointer, mapId] of mapPointers)
			{
				const tilesetId = this.buffer[0 + mapPointer];
				const height    = this.buffer[1 + mapPointer];
				const width     = this.buffer[2 + mapPointer];

				const tilePointer    = this.makeRef(bank, this.buffer.slice(3 + mapPointer, 5 + mapPointer));
				const textPointers   = this.buffer.slice(5 + mapPointer, 7 + mapPointer);
				const scriptPointer  = this.buffer.slice(7 + mapPointer, 9 + mapPointer);
				const connectionByte = this.buffer[9 + mapPointer];

				const east  = connectionByte & (1 << 0);
				const west  = connectionByte & (1 << 1);
				const south = connectionByte & (1 << 2);
				const north = connectionByte & (1 << 3);

				const activeConnections = [north, south, west, east].filter(x=>x).length;

				const objectPointer = this.buffer[10 + 11 * activeConnections + mapPointer];

				const connections = [];

				for(let c = 0; c < activeConnections; c ++)
				{
					const connection = this.buffer.slice((0+c)*11 + mapPointer, (1+c)*11 + mapPointer);

					connections.push(connection);
				}

				const blockIds  = this.deref(tilePointer, null, width * height);

				maps.push({
					id: Number(mapId)
					, tilesetId
					, tileset: null
					, height
					, width
					, bank
					, tilePointer
					// , collision
					, textPointers
					, scriptPointer
					, connectionByte
					, north, south, west, east
					, objectPointer
					, blockIds
				});
			}

			return Promise.all([maps, this.getAllTilesets()]);

		}).then(([maps, tilesets]) => {

			for(const map of maps)
			{
				const tileset = map.tileset = tilesets[ map.tilesetId ];

				if(!tileset)
				{
					continue;
				}

				const collision = this.deref(tileset.collisionPointer, 0xFF);

				map.collision = Object.values(collision);

				const blocks = {};

				const tiles = {};

				if(!map.tileset)
				{
					continue;
				}

				const tilePlane  = new Uint8Array(map.width * map.height * 4 * 4);
				const solidPlane = new Uint8Array(map.width * map.height * 4 * 4);
				const blockPlane = [];

				for(const blockIndex in map.blockIds)
				{
					const blockId     = map.blockIds[blockIndex];
					const blockOffset = map.tileset.blockPointer + blockId * 16;

					const block = this.buffer.slice(0 + blockOffset, 16 + blockOffset);

					blocks[blockId] = block;

					for(const tileIndex in block)
					{
						const tileId     = block[tileIndex];
						const tileOffset = map.tileset.tilePointer + tileId * 16;

						const tile = this.buffer.slice(0 + tileOffset, 16 + tileOffset);

						tiles[tileId] = tile;

						const xBlockOffset = blockIndex % map.width;
						const yBlockOffset = Math.floor(blockIndex / map.width);

						const xTileOffset = tileIndex % 4;
						const yTileOffset = Math.floor(tileIndex / 4);

						const xPlaneOffset = xTileOffset + xBlockOffset * 4;
						const yPlaneOffset = yTileOffset + yBlockOffset * 4;

						const tilePlaneIndex = xPlaneOffset + yPlaneOffset * map.width * 4;

						tilePlane[tilePlaneIndex]  = 1 + tileId;
						solidPlane[tilePlaneIndex] = !map.collision.includes(tileId);
					}
				}

				map.tilePlane  = tilePlane;
				map.solidPlane = solidPlane;
				map.blockPlane = blockPlane;
				// map.collision = collision;

				if(!tiles)
				{
					return;
				}

				const pallet = [255,128,196,64];

				const ansi = [
					  x => `\x1b[48;2;255;255;255m\x1b[38;2;192;192;192m${x}\x1b[0m`
					, x => `\x1b[48;2;128;128;128m\x1b[38;2;64;64;64m${x}\x1b[0m`
					, x => `\x1b[48;2;196;196;196m\x1b[38;2;128;128;128m${x}\x1b[0m`
					, x => `\x1b[48;2;64;64;64m\x1b[38;2;32;32;32m${x}\x1b[0m`
				];

				// console.log(map);

				const renderedTiles = {};

				Object.keys(tiles).forEach(tileIndex => {

					const tile = tiles[tileIndex];

					// console.log(tile, tileIndex);

					const bitPairs = [];

					let i = 0;

					while(i < 16)
					{
						const byteA = tile[i++];
						const byteB = tile[i++];

						const colors = [
							(((byteA & 0b10000000) << 1) | (byteB & 0b10000000)) >> 7
							, (((byteA & 0b01000000) << 1) | (byteB & 0b01000000)) >> 6
							, (((byteA & 0b00100000) << 1) | (byteB & 0b00100000)) >> 5
							, (((byteA & 0b00010000) << 1) | (byteB & 0b00010000)) >> 4
							, (((byteA & 0b00001000) << 1) | (byteB & 0b00001000)) >> 3
							, (((byteA & 0b00000100) << 1) | (byteB & 0b00000100)) >> 2
							, (((byteA & 0b00000010) << 1) | (byteB & 0b00000010)) >> 1
							, (((byteA & 0b00000001) << 1) | (byteB & 0b00000001)) >> 0
						];

						bitPairs.push(...colors);
					}

					// console.log([...tile].map(b => b.toString(16).padStart(2,'0')).join(' '));

					// console.log(`Map id: ${map.id}, Tile Index ${tileIndex}:`);

					// for(const i in bitPairs)
					// {
					// 	const bp = bitPairs[i];

					// 	process.stdout.write( ansi[bp]('  ') )

					// 	if(i % 8 === 7)
					// 	{
					// 		process.stdout.write( `\n` );
					// 	}
					// }

					// process.stdout.write( `\n` );

					renderedTiles[tileIndex] = bitPairs;
				});

				map.renderedTiles = renderedTiles;

				const renderedBlocks = {};

				for(const blockId in blocks)
				{
					if(renderedBlocks[blockId])
					{
						continue;
					}

					const block = blocks[blockId];

					// const lines = Array(32).fill().map(l => Array(32).fill(0));
					const bytes = Array(32).fill().map(l => Array(32).fill(0));

					for(const tileIndex in block)
					{
						const tileId = block[tileIndex];
						const tile   = renderedTiles[tileId];

						if(!tile)
						{
							// console.log({tileIndex, tileId});
							continue;
						}

						const tileX = 8 * (tileIndex % 4);
						const tileY = 8 * Math.floor(tileIndex / 4);

						for(let i = 0; i < 8; i++)
						{
							const x = i + tileX;

							for(let j = 0; j < 8; j++)
							{
								const y = j + tileY;

								// lines[y][x] = tile[i + j * 8];
								bytes[y][x] = tile[i + j * 8];
							}
						}
					}

					// for(const line of lines)
					// {
					// 	line.map(b => process.stdout.write( ansi[b]('  ') ) )
					// 	console.log(' ');
					// }

					// console.log(' ');

					renderedBlocks[blockId] = [].concat(...bytes);
				}

				map.renderedBlocks = renderedBlocks;
				map.blocks = blocks;
			}

			return [maps, tilesets];
		});
	}

	getPokemonName(indexNumber)
	{
		const bytes = this.deref(this.offsets.namesStart + 0xA * indexNumber, 0x50, 0xA);

		return Promise.resolve(this.decodeText(bytes));
	}

	getPokemonNumber(indexNumber)
	{
		return this.slice(this.offsets.dexOrder, 190)
		.then(buffer => {
			return buffer[indexNumber];
		});
	}

	getPokemonStats(indexNumber)
	{
		let spriteBank;

		if(indexNumber === 0x14)
		{
			spriteBank = 0x1;
		}
		else if(indexNumber === 0xB5)
		{
			spriteBank = 0xB;
		}
		else if(indexNumber < 0x1F)
		{
			spriteBank = 0x9;
		}
		else if(indexNumber < 0x49)
		{
			spriteBank = 0xA;
		}
		else if(indexNumber < 0x73)
		{
			spriteBank = 0xB;
		}
		else if(indexNumber < 0x98)
		{
			spriteBank = 0xC;
		}
		else
		{
			spriteBank = 0xD;
		}

		return this.getPokemonNumber(indexNumber).then(number => {
			let offset = 0x383DE + (28 * (number - 1));

			if(indexNumber === 0x14)
			{
				offset = 0x425B;
			}

			return this.slice(offset, 28).then(buffer => {
				return {
					index:             Number(indexNumber) || indexNumber
					, number:          buffer[0]
					, hp:              buffer[1]
					, attack:          buffer[2]
					, defense:         buffer[3]
					, speed:           buffer[4]
					, special:         buffer[5]
					, type1:           buffer[6]
					, type2:           buffer[7]
					, catchRate:       buffer[8]
					, expYield:        buffer[9]
					, frontSpriteSize: buffer[10]
					, frontSprite:     this.formatRef(spriteBank, buffer.slice(11, 13))
					, backSprite:      this.formatRef(spriteBank, buffer.slice(13, 15))
					, basicMoves:      [buffer[15], buffer[16], buffer[17], buffer[18]]
					, tmMoves:         buffer.slice(20, 28)
				};
			});
		});
	}

	getAllPokemon()
	{
		return this.slice(this.offsets.dexOrder, 190)
		.then(buffer => {
			const promises = [];

			for (var i = 0; i < buffer.length; i++)
			{
				// console.log(i);

				promises.push( this.getPokemon(i) );
			}

			return Promise.all(promises);
		});
	}

	getAllPokemonPalettes()
	{
		return this.slice(this.offsets.palletPointers, 150)
		.then(buffer => {

			const used = [];

			for(const byte of buffer)
			{
				used.push(byte);
			}

			return used;
		});
	}

	getAllPalettes()
	{
		return this.piece(this.offsets.palletStart, this.offsets.palletEnd)
		.then(buffer => {

			// console.log(...buffer);

			let index = 0;

			const bytes = [];

			this.palettes = [];

			for(const byte of buffer)
			{
				if(!this.palettes[ index ])
				{
					this.palettes[ index ] = [];
				}

				bytes.push(byte);

				if(bytes.length >= 8)
				{
					const palette = this.palettes[ index ];

					for(let i = 0; i < bytes.length; i += 2)
					{
						const binColor = bytes[i] + (bytes[i + 1] << 8);

						palette.push({
							r:   (binColor & 0b000000000011111) >> 0
							, g: (binColor & 0b000001111100000) >> 5
							, b: (binColor & 0b111110000000000) >> 10
						});
					}

					bytes.splice(0);

					index++;
				}
			}

			return this.palettes;
		});
	}

	getPokemon(index)
	{
		const getAllTypes = this.getAllTypes();
		const getAllMoves = this.getAllMoves();
		const getPokedex  = this.getPokedexEntry(index);
		const getNumber   = this.getPokemonNumber(index);
		const getName     = this.getPokemonName(index);
		const getStats    = this.getPokemonStats(index);
		const getLevelUp  = this.getLevelUpActions(index);
		const getBackSize = this.getBackSpriteLength(index);
		const getTmMoves  = this.getTmMoves();

		const getPokemon = Promise.all([
			getAllTypes
			, getAllMoves
			, getNumber
			, getPokedex
			, getName
			, getStats
			, getLevelUp
			, getBackSize
			, getTmMoves
		])

		return getPokemon.then(([allTypes, allMoves, number, dex, name, stats, levelUp, backSize, tmIndex])=>{

			const s = [
				0x0,0x1,0x2,0x3,
				0xA,0xB,0xC,0xD,
				null,null,null,null,
				null,null,null,null,
				null,null,null,
				0xE,0x4,0x5,0x6,
				0x7,0x8,0x9,0xF
			];

			const type = t => {

				const tt = s[t];

				return allTypes[tt];
			}

			const types = [type(stats.type1)]

			if(stats.type1 !== stats.type2)
			{
				types[1] = type(stats.type2);
			}

			for(const i in stats.basicMoves)
			{
				const moveId = -1 + stats.basicMoves[i];

				if(moveId === -1)
				{
					continue;
				}

				if(allMoves[moveId])
				{
					const move = allMoves[moveId];

					stats.basicMoves[i] = {moveId, move};
				}
			}

			stats.basicMoves = stats.basicMoves.filter(x=>x);

			const basicMoves = stats.basicMoves;
			const sprites = {
				front: stats.frontSprite
				, back: stats.backSprite
			};

			const tmMoves = this.parseTmMoves(stats.tmMoves, tmIndex);

			sprites.front.length = stats.frontSpriteSize * 8;
			sprites.back.length = backSize;

			delete stats.type1;
			delete stats.type2;
			delete stats.basicMoves;
			delete stats.frontSprite;
			delete stats.frontSpriteSize;
			delete stats.backSprite;
			// delete stats.backSpriteSize;
			delete stats.tmMoves;

			const levelUpMoves = [];

			for(const i in levelUp.learnset)
			{
				const moveId = levelUp.learnset[i].move - 1;
				const level  = levelUp.learnset[i].level;

				if(allMoves[moveId] === -1)
				{
					continue;
				}

				const move = allMoves[moveId];

				levelUpMoves[i] = {moveId, move, level};
			}

			const evoPromise = [];
			const evolutions = [];

			for(const i in levelUp.evolutions)
			{
				const evoIndex = levelUp.evolutions[i].index;
				const evoType  = levelUp.evolutions[i].type;

				const level = levelUp.evolutions[i].level;

				const evo = this.getPokemonNumber(evoIndex - 1).then(evoNumber => {

					return this.getPokemonName(evoIndex - 1).then(evoName => {

						let type;

						switch(evoType)
						{
							case 1:
								type = 'Level';
								break;
							case 2:
								type = 'Stone';
								break;
							case 3:
								type = 'Trade';
								break;
						}

						return {
							name: evoName
							, type
							, level
							, index: evoIndex
							, number: evoNumber
							, item: levelUp.evolutions[i].item || undefined
						};

					});
				});

				evoPromise.push(evo);
			}

			return Promise.all(evoPromise).then(
				evolutions => ({
					name
					, number
					, index
					, types
					, dex
					, evolutions
					, stats
					, sprites
					, basicMoves
					, levelUpMoves
					, tmMoves
				})
			);
		});
	}

	getPokedexEntry(indexNumber)
	{
		return this.piece(this.offsets.dexStart, this.offsets.dexEnd)
		.then((buffer) => {
			let pointer = 0
				+ (buffer[ indexNumber * 2+1 ] << 8)
				+ (buffer[ indexNumber * 2+0 ] << 0);

			pointer -= 0x4000;
			pointer += 0x40000;

			const bytes = this.deref(pointer, 0x50);

			let type = this.decodeText(bytes);

			let nextPointer = pointer + bytes.length + 1;

			// if(nextPointer == 0x40fe9)
			// {
			// 	return;
			// }

			return this.slice(nextPointer, 9).then((bytes) => {

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

				const entryBytes = this.deref(dexPointer, 0x50, 512);

				let entry = this.decodeText(entryBytes);

				return({type, feet, inches, pounds, entry});
			});
		});
	}

	getLevelUpActions(indexNumber)
	{
		return this.slice((indexNumber*2) + this.offsets.levelUp, 2)
		.then(pointerBytes => {

			const evoPointer = this.makeRef(0x0E, pointerBytes);
			const evoBytes   = this.deref(evoPointer, 0x0);

			const learnPointer = evoPointer + evoBytes.length + 1;
			const learnBytes   = this.deref(learnPointer, 0x0);

			const evolutions = this.parseEvolutions(evoBytes);
			const learnset   = this.parseLearnset(learnBytes);

			return {evolutions, learnset};
		});
	}

	parseEvolutions(bytes)
	{
		const evolutions = [];

		for(let i = 0; i < bytes.length;)
		{
			const type  = bytes[i++];

			let level, index, item;

			switch(type)
			{
				case 1:
					level = bytes[i++];
					index = bytes[i++];
					evolutions.push({type, level, index});
					break;

				case 2:
					item  = bytes[i++];
					level = bytes[i++];
					index = bytes[i++];
					evolutions.push({type, item, level, index});
					break;

				case 3:
					level = bytes[i++];
					index = bytes[i++];
					evolutions.push({type, level, index});
					break;
			}
		}

		return evolutions;
	}

	parseLearnset(bytes)
	{
		const learnset = [];

		for(let i = 0; i < bytes.length; i += 2)
		{
			const level = bytes[i + 0];
			const move  = bytes[i + 1];

			learnset.push({level, move});
		}

		return learnset;
	}

	parseTmMoves(bytes, table)
	{
		const canLearn = [];

		for(let i = 0; i < 64; i++)
		{
			const byte = Math.trunc(i / 8);
			const bit  = i % 8;

			if(bytes[ byte ] & (1 << bit))
			{
				let id = 1+i;
				let type = 'TM';

				if(id > 50)
				{
					id -= 50;
					type = 'HM';
				}

				canLearn.push(Object.assign({type, id}, table[i]));
			}
		}

		return canLearn;
	}

	getFrontSprite(index)
	{
		return this.getPokemonStats(index)
		.then(stats => this.slice(stats.frontSprite.offset))
		.then(input => {
			const rleDelta = new RleDelta(input);

			rleDelta.decompress();

			const merge = new Merge(rleDelta.buffer, rleDelta.xSize);

			merge.decompress();

			return merge.buffer;
		});
	}

	getBackSpriteLength(index)
	{
		return this.getBackSpriteMeta(index).then(m => m[0]);
	}

	getBackSprite(index)
	{
		return this.getBackSpriteMeta(index).then(m => m[1]);
	}

	getBackSpriteMeta(index)
	{
		return this.getPokemonStats(index)
		.then(stats => this.slice(stats.backSprite.offset))
		.then((input) => {
			const rleDelta = new RleDelta(input);

			rleDelta.decompress();

			const merge = new Merge(rleDelta.buffer, rleDelta.xSize);

			merge.decompress();

			const sourceLength = rleDelta.bits.i;

			return [sourceLength, merge.buffer];
		});
	}

	// lzDecompress(start)
	// {
	// 	return this.slice(start).then((buffer) => {

	// 		const eof = 0xFF;
	// 		let o = 0;

	// 		let width  = buffer[0] & 0xF;
	// 		let height = (buffer[0] & 0xF0) >> 4;

	// 		const out = new Uint8Array(width * height * 8 * 8);

	// 		for (let i = 1; i < buffer.length;)
	// 		{
	// 			const n = buffer[i++];

	// 			if(n === eof)
	// 			{
	// 				console.error(`EOF after ${i++} bytes read, ${o} bytes written.`);
	// 				break;
	// 			}

	// 			let code = n >> 5;
	// 			let c    = n & 0x1F;

	// 			let decoded;

	// 			if(code === 0x7)
	// 			{
	// 				code = c >> 2;
	// 				c = (buffer[i++] & 3) * 256;
	// 				c += buffer[i++] + 1;
	// 			}

	// 			code > 0 && console.error('code:', code, 'c', c);

	// 			decoded = [];

	// 			let offset, direction, b, b1, b2;

	// 			switch(code)
	// 			{
	// 				case 0x0:
	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = buffer[i++];
	// 					}

	// 					break;

	// 				case 0x1:
	// 					b  = buffer[i++];

	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = b;
	// 					}

	// 					break;

	// 				case 0x2:
	// 					b1 = buffer[i++];
	// 					b2 = buffer[i++];

	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = (ii %2 ? b2 : b1);
	// 					}

	// 					break;

	// 				case 0x3:

	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = 0x0;
	// 					}

	// 					break;

	// 				case 0x4:
	// 					b = buffer[i++];

	// 					if(b < 0x80)
	// 					{
	// 						b2 = buffer[i++];

	// 						offset = out.length % (b * 256 + b2);

	// 						console.error('4', {length: out.length, offset,c,b, b2});
	// 					}
	// 					else
	// 					{
	// 						b = b & 0x7f;

	// 						offset = o - b;

	// 						console.error('4', {length: out.length, offset,c, b});
	// 					}


	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = out[offset + ii];
	// 					}
	// 					break;

	// 				case 0x5:
	// 					b = buffer[i++];

	// 					if(b >= 0x80)
	// 					{
	// 						b = b & 0x7f;

	// 						offset = o - b;

	// 						console.error('5', {length: out.length, offset,c,b});
	// 					}
	// 					else
	// 					{
	// 						b2 = buffer[i++];

	// 						offset = out.length % (b * 256 + b2);

	// 						console.error('5', {length: out.length, offset,c,b,b2});
	// 					}

	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = out[offset + ii];
	// 					}
	// 					break;

	// 				case 0x6:
	// 					b = buffer[i++];

	// 					if(b >= 0x80)
	// 					{
	// 						b = b & 0x7f;

	// 						offset = o - b;

	// 						console.error('6', {length: out.length, offset,b});
	// 					}
	// 					else
	// 					{
	// 						b2 = buffer[i++];

	// 						offset = out.length % (b * 256 + b2);

	// 						console.error('6', {length: out.length, offset,b,b2});
	// 					}

	// 					for(let ii = 0; ii <= c; ii++)
	// 					{
	// 						out[o++] = out[offset - ii];
	// 					}
	// 					break;
	// 			}

	// 			if(o > out.length)
	// 			{
	// 				break;
	// 			}
	// 		}

	// 		process.stdout.write(out);

	// 		// out.forEach(b => {

	// 		// })
	// 	});
	// }
}
