import { Rom } from './Rom';

export class GameboyRom extends Rom
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

	deref(start, terminator, max)
	{
		let bytes = [];

		for (let i = start; i < this.buffer.length; i += 1)
		{
			if(this.buffer[i] === terminator || bytes.length >= max)
			{
				return new Uint8Array(bytes);
			}
			else
			{
				bytes.push(this.buffer[i]);
			}
		}

		return bytes;
	}

	makeRef(bankByte, buffer)
	{
		return (bankByte << 14) + (this.byteVal(buffer) & 0x3fff);
	}

	formatRef(bank, buffer)
	{
		const offset  = this.makeRef(bank, buffer);
		const pointer = this.byteVal(buffer);

		return {bank, pointer, offset};
	}
}
