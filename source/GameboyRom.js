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
}
