import { GameboyRom } from './GameboyRom';
import { BitArray   } from './BitArray';

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
				text += ' ';
			}
		}

		return text.trim();
	}

	getAllTypes()
	{
		return this.piece(0x27DE4, 0x27E49).then((buffer) => {
			return this.decodeText(buffer).split(' ');
		});
	}

	getPokemonName(indexNumber)
	{
		return this.slice(0x2FA3, 1).then((buffer) => {

			let bankByte = buffer[0];

			return this.slice(0x2FAE, 2).then((buffer) => {
				// let pointer = 0
				// 	+ (bankByte * 0x4000)
				// 	+ (buffer[1] << 8)
				// 	+ (buffer[0] << 0);

				// pointer -= 0x4000;

				let pointer = this.makeRef(bankByte, buffer);

				const bytes = this.deref(pointer + 0xA * indexNumber, 0x50, 0xA);

				return this.decodeText(bytes);
			});
		});
	}

	getPokemonNumber(indexNumber)
	{
		return this.slice(0x41024, 190).then(buffer => {
			return buffer[indexNumber];
		});
	}

	getPokemonStats(indexNumber)
	{
		let spriteBank;

		if(indexNumber === 0x15)
		{
			spriteBank = 0x1;
		}
		else if(indexNumber === 0xB6)
		{
			spriteBank = 0xB;
		}
		else if(indexNumber < 0x1F)
		{
			spriteBank = 0x9;
		}
		else if(indexNumber < 0x4A)
		{
			spriteBank = 0xA;
		}
		else if(indexNumber < 0x74)
		{
			spriteBank = 0xB;
		}
		else if(indexNumber < 0x99)
		{
			spriteBank = 0xC;
		}
		else
		{
			spriteBank = 0xD;
		}

		return this.getPokemonNumber(indexNumber).then(number => {
			return this.slice(0x383DE + (28 * (number - 1)), 28).then(buffer => {
				return {
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
					, frontSprite:     this.formatRef(spriteBank, buffer.slice(11, 13))
					, backSprite:      this.formatRef(spriteBank, buffer.slice(13, 15))
					, basiceMove1:     buffer[15]
					, basiceMove2:     buffer[16]
					, basiceMove3:     buffer[17]
					, basiceMove4:     buffer[18]
				};
			});
		});
	}

	getAllPokemon()
	{
		return this.slice(0x41024, 190).then(buffer => {
			const promises = [];

			for (var index = 0; index < buffer.length; index++)
			{
				const getPokedex = this.getPokedexEntry(index);
				const getNumber  = this.getPokemonNumber(index);
				const getName    = this.getPokemonName(index);
				const getStats   = this.getPokemonStats(index);

				const getAllTypes = this.getAllTypes();

				const getPokemon = Promise.all([getNumber, getName, getPokedex, getStats, getAllTypes])

				promises.push(getPokemon.then(([number, name, dex, stats, allTypes])=>{

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

					return { name, number, types, dex, index, stats }
				}));
			}

			return Promise.all(promises);
		});
	}

	getPokedexEntry(indexNumber)
	{
		return this.piece(0x4047E, 0x405FA).then((buffer) => {
			let pointer = 0
				+ (buffer[ indexNumber * 2+1 ] << 8)
				+ (buffer[ indexNumber * 2+0 ] << 0);

			pointer -= 0x4000;
			pointer += 0x40000;

			const bytes = this.deref(pointer, 0x50);

			let type = this.decodeText(bytes);

			let nextPointer = pointer + bytes.length + 1;

			if(nextPointer == 0x40fe9)
			{
				return;
			}

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

	rleDecompress(start, maxLen = 0)
	{
		const table2 = [
			[0, 1, 3, 2, 7, 6, 4, 5, 0xf, 0xe, 0xc, 0xd, 8, 9, 0xb, 0xa],
			[0xf, 0xe, 0xc, 0xd, 8, 9, 0xb, 0xa, 0, 1, 3, 2, 7, 6, 4, 5],
		];

		const table3 = [...Array.from(16)].map((_,i)=> bitFlip(i, 4));

		return this.slice(start).then((buffer) => {
			const bits  = new BitArray(buffer);
			const xSize = bits.next(4) * 8;
			const ySize = bits.next(4);
			const size  = xSize * ySize;
			const order = bits.next();

			const bitFlip = (x, n) => {
				let r = 0;

				while(n)
				{
					r = (r << 1) | (x & 1);
					x >>= 1;
					n -= 1;
				}

				return r;
			};

			const deinterlace = (bits) => {
				const outputBits = new BitArray(bits.buffer.length);
				let o = 0;

				for(let y = 0; y < ySize; y++)
				{
					for(let x = 0; x < xSize; x++)
					{
						let i = 4 * y * xSize + x;

						for(let j in [0,1,2,3])
						{
							outputBits.set(o++, bits.get(i));

							i += xSize;
						}
					}
				}

				return outputBits;
			};

			const expand = (originalBits) => {
				const bytes = new Uint8Array(originalBits.buffer.length * 2);
				const bits  = new BitArray(originalBits);

				let o = 0;

				while(!bits.done)
				{
					bytes[o++] = (
						(bits.next() << 6)
						| (bits.next() << 4)
						| (bits.next() << 2)
						| (bits.next() << 0)
					);
				}

				console.error(originalBits.buffer.length, o);

				return bytes;
			};

			const rleFill = (buffer, i) => {
				let ii = 0;

				while(bits.next())
				{
					ii++;
				}

				const n = 2 << ii;
				const a = bits.next(ii+1)
				const m = n + a;

				for(let j = 0; j < m; j++)
				{
					buffer.set(i++, 0);
				}

				return i;
			}

			const dataFill = (buffer, i) => {
				while(true)
				{
					const b1 = bits.next();
					const b2 = bits.next();

					if(!b1 && !b2)
					{
						break;
					}

					// console.error(i, b1, b2);

					buffer.set(i++, b2);
					buffer.set(i++, b1);
				}

				return i;
			}

			const fillBuffer = buffer => {
				const bitSize = size * 4;
				let mode = bits.next();
				let i = 0;

				while(i < bitSize)
				{
					if(mode === 0)
					{
						i = rleFill(buffer, i);
						mode = 1;
					}
					else if(mode === 1)
					{
						i = dataFill(buffer, i);
						mode = 0;
					}
				}

				const interlaced   = new BitArray(buffer);
				const deinterlaced = deinterlace(interlaced);

				for(let d in deinterlaced.buffer)
				{
					buffer.buffer[d] = deinterlaced.buffer[d];
				}
			}

			const merge1 = (buffer) => {
				for(let x = 0; x < xSize; x++)
				{
					let bit = 0;

					for(let y = 0; y < ySize; y++)
					{
						const i = y * xSize + x;

						let a = buffer[i] >> 4 & 0xF;
						let b = buffer[i] & 0xF;

						a = table2[bit][a];

						bit = a & 1;

						b = table2[bit][b];

						buffer[i] = (a << 4) | b;
					}
				}
			};

			const merge2 = (buffer1, buffer2) => {
				for(let i = 0; i < buffer2.length; i++)
				{
					// let a = buffer2[1] >> 4;
					// let b = buffer2[1] & 0xF;

					// a = table3[a];
					// b = table3[b];

					// buffer2 = a << 4 | b;

					buffer2[i] ^= buffer1[1];
				}
			};

			const buffers = [new BitArray(size), new BitArray(size)];

			const bufA = buffers[order ^ 1];
			const bufB = buffers[order];

			let mode = bits.next();

			fillBuffer(bufA);

			if(mode === 1)
			{
				mode = 1 + bits.next();
			}

			fillBuffer(bufB);

			const bytesA = expand(bufA);
			const bytesB = expand(bufB);

			if(mode === 0)
			{
				merge1(bytesA);
				merge1(bytesB);
			}
			else if(mode === 1)
			{
				merge1(bytesA);
				merge2(bytesA, bytesB);
			}
			else if($mode === 2)
			{
				merge1(bytesB);
				merge1(bytesA);
				merge2(bytesA, bytesB);
			}

			const output = new BitArray(bufA.buffer.length);

			const expandedBitsA = new BitArray(bytesA);
			const expandedBitsB = new BitArray(bytesB);

			let i = 0;

			while(!expandedBitsA.done)
			{
				const a = expandedBitsA.next();
				const b = expandedBitsB.next();

				output.set(i++, a);
				output.set(i++, b);
			}

			// process.stdout.write(output.buffer.map(x=>x.toString(16)).join(','));

			// process.stdout.write(bufA.buffer);
			// process.stdout.write(bufB.buffer);

			// // process.stdout.write(bytesA);
			// // process.stdout.write(bytesB);

			process.stdout.write(expand(output));
		});
	}

	lzDecompress(start)
	{
		return this.slice(start).then((buffer) => {

			const eof = 0xFF;
			let o = 0;

			let width  = buffer[0] & 0xF;
			let height = (buffer[0] & 0xF0) >> 4;

			const out = new Uint8Array(width * height * 8 * 8);

			for (let i = 1; i < buffer.length;)
			{
				const n = buffer[i++];

				if(n === eof)
				{
					console.error(`EOF after ${i++} bytes read, ${o} bytes written.`);
					break;
				}

				let code = n >> 5;
				let c    = n & 0x1F;

				let decoded;

				if(code === 0x7)
				{
					code = c >> 2;
					c = (buffer[i++] & 3) * 256;
					c += buffer[i++] + 1;
				}

				code > 0 && console.error('code:', code, 'c', c);

				decoded = [];

				let offset, direction, b, b1, b2;

				switch(code)
				{
					case 0x0:
						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = buffer[i++];
						}

						break;

					case 0x1:
						b  = buffer[i++];

						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = b;
						}

						break;

					case 0x2:
						b1 = buffer[i++];
						b2 = buffer[i++];

						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = (ii %2 ? b2 : b1);
						}

						break;

					case 0x3:

						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = 0x0;
						}

						break;

					case 0x4:
						b = buffer[i++];

						if(b < 0x80)
						{
							b2 = buffer[i++];

							offset = out.length % (b * 256 + b2);

							console.error('4', {length: out.length, offset,c,b, b2});
						}
						else
						{
							b = b & 0x7f;

							offset = o - b;

							console.error('4', {length: out.length, offset,c, b});
						}


						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = out[offset + ii];
						}
						break;

					case 0x5:
						b = buffer[i++];

						if(b >= 0x80)
						{
							b = b & 0x7f;

							offset = o - b;

							console.error('5', {length: out.length, offset,c,b});
						}
						else
						{
							b2 = buffer[i++];

							offset = out.length % (b * 256 + b2);

							console.error('5', {length: out.length, offset,c,b,b2});
						}

						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = out[offset + ii];
						}
						break;

					case 0x6:
						b = buffer[i++];

						if(b >= 0x80)
						{
							b = b & 0x7f;

							offset = o - b;

							console.error('6', {length: out.length, offset,b});
						}
						else
						{
							b2 = buffer[i++];

							offset = out.length % (b * 256 + b2);

							console.error('6', {length: out.length, offset,b,b2});
						}

						for(let ii = 0; ii <= c; ii++)
						{
							out[o++] = out[offset - ii];
						}
						break;
				}

				if(o > out.length)
				{
					break;
				}
			}

			process.stdout.write(out);

			// out.forEach(b => {

			// })
		});
	}
}
