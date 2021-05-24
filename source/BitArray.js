export class BitArray
{
	constructor(buffer = undefined)
	{
		if(buffer === undefined)
		{
			buffer = [];
		}

		if(typeof buffer === 'number')
		{
			buffer = Array.from(Array(buffer));
		}

		if(Array.isArray(buffer))
		{
			buffer = new Uint8Array(buffer);
		}

		if(buffer instanceof BitArray)
		{
			buffer = buffer.buffer;
		}

		this.buffer = buffer;
		this.done   = false;
		this.i = this.j = 0;
	}

	clone()
	{
		return new this.constructor(this);
	}

	get(address)
	{
		const byteAddress = Math.floor(address / 8);
		const bitOffset   = address % 8;
		const getMask     = 0x1 << bitOffset;

		// console.log(getMask.toString(2), this.buffer[ byteAddress ].toString(2));

		return (getMask & this.buffer[ byteAddress ]) >> bitOffset;
	}

	// read()
	// {
	// 	yield 0;
	// 	yield 1;
	// 	yield 2;
	// 	yield 3;
	// }

	set(address, value)
	{
		const byteAddress = Math.floor(address / 8);
		const bitOffset   = address % 8;
		const setMask     = value ? (0x1 << bitOffset) : ~(0x1 << bitOffset);

		if(value)
		{
			this.buffer[ byteAddress ] |= setMask;
		}
		else
		{
			this.buffer[ byteAddress ] &= setMask;
		}
	}

	next(x = 1)
	{
		let result = 0;
		const count = x;

		let byte = this.buffer[this.i];

		while(x-- > 0)
		{
			const bit = (byte >> (7 - this.j)) & 0x1;

			this.j++;

			if(this.j > 7)
			{
				this.j = 0;

				byte = this.buffer[++this.i];
			}

			if(this.i >= this.buffer.length)
			{
				this.done = true;
			}

			result <<= 1;
			result |= bit;
		}

		return result;
	}

	get length()
	{
		return this.buffer.length * 8;
	}
}
