import { BitArray } from '../BitArray';

export class RleDelta
{
	tileSize   = 8
	fillMode   = null;
	lastBit    = 0;
	deltaCount = 0;
	fillCount  = 0;
	xorCount   = 0;

	constructor(input)
	{
		this.input = input;
		this.bits  = new BitArray(input);

		this.xSize = this.bits.next(4) || 7;
		this.ySize = this.bits.next(4) || 7;

		this.sideSize = this.xSize;

		this.xSize *= this.tileSize;

		this.size  = this.xSize * this.ySize;

		this.xSize = this.xSize <= 56 ? this.xSize : 56;
		this.ySize = this.ySize <= 7  ? this.ySize : 7;

		this.buffSize = (this.sideSize ** 2) * this.tileSize;

		this.buffer = new Uint8Array(this.buffSize*2);

		this.bufferA = new Uint8Array(this.buffer.buffer, this.buffSize*0, this.buffSize*1);
		this.bufferB = new Uint8Array(this.buffer.buffer, this.buffSize*1, this.buffSize*1);
	}

	decompress()
	{
		const buffer  = this.buffer;
		const bits    = this.bits;
		const xSize   = this.xSize;
		const ySize   = this.ySize;
		const size    = this.size;

		const buffers = [new BitArray(this.bufferA), new BitArray(this.bufferB)];

		const order = bits.next();

		const bufA  = buffers[order];
		const bufB  = buffers[order ^ 1];

		this.fillCount = 0;
		this.fillMode  = bits.next();

		while(this.fillBuffer(bufA, bits, xSize, size));

		let mode = bits.next();

		if(mode === 1)
		{
			mode = 1 + bits.next();
		}

		this.fillCount = 0;
		this.fillMode  = bits.next();

		while(this.fillBuffer(bufB, bits, xSize, size));

		switch(mode)
		{
			case 0:

				this.deltaCount = 0;
				while( this.deltaFill(bufA, xSize) );

				this.deltaCount = 0;
				while( this.deltaFill(bufB, xSize) );

				break;

			case 1:

				this.deltaCount = 0;
				while( this.deltaFill(bufA, xSize) );

				this.xorCount = 0;
				while( this.xorFill(bufA, bufB) );

				break;

			case 2:

				this.deltaCount = 0;
				while( this.deltaFill(bufA, xSize) );

				this.deltaCount = 0;
				while( this.deltaFill(bufB, xSize) );

				this.xorCount = 0;
				while( this.xorFill(bufA, bufB) );

				break;
		}
	}

	pixelToRowPixel(pixel)
	{
		const width  = this.sideSize * this.tileSize;
		const pEven  = pixel % 2 === 0;
		const xOff   = Math.floor(pixel / width);
		const xEven  = xOff % 2 == 0;
		const yOff   = pixel % width;

		const result = (xOff * 2 + yOff * width) + (pEven ? 0:-(width-1));

		return result;
	}

	xorFill(bitsA, bitsB)
	{
		if(this.xorCount >= this.buffSize * 8)
		{
			return false;
		}

		const bitA = bitsA.get(this.xorCount);
		const bitB = bitsB.get(this.xorCount);

		bitsB.set(this.xorCount, bitA^bitB);

		this.xorCount++;

		return true;
	}

	deltaFill(bits, xSize)
	{
		if(this.deltaCount % (this.sideSize * this.tileSize) === 0)
		{
			this.lastBit = 0;
		}

		const pixel = this.pixelToRowPixel(this.deltaCount);

		const bit = bits.get(pixel);

		if(bit)
		{
			this.lastBit = 1 ^ this.lastBit;
		}

		bits.set(pixel, this.lastBit);

		this.deltaCount++;

		if(this.deltaCount < this.buffSize * 8)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	fillBuffer(buffer, bits, xSize, size)
	{
		const bitSize = size * 8;

		if(this.fillMode === 0)
		{
			this.rleFill(buffer, bits);

			this.fillMode = 1;
		}
		else if(this.fillMode === 1)
		{
			this.dataFill(buffer, bits, bitSize);

			this.fillMode = 0;
		}

		if(this.fillCount < bitSize)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	rleFill(buffer, bits)
	{
		let i = 0;
		let bit = '';
		let read = '';

		while(bit = bits.next())
		{
			read += bit;
			i++;
		}

		read += bit;

		const n = bits.next(i+1);
		const x = (2 << i) + -1 + n;

		for(let j = 0; j < x; j++)
		{
			this.fillCount++;
			this.fillCount++;
		}
	}

	dataFill(buffer, bits, bitSize)
	{
		const fill = [];

		while(this.fillCount < bitSize)
		{
			const b1 = bits.next();
			const b2 = bits.next();

			if(b1 === 0 && b2 === 0)
			{
				break;
			}

			fill.push(b1,b2);

			b1 && buffer.set(this.fillCount, b1);
			this.fillCount++;

			b2 && buffer.set(this.fillCount, b2);
			this.fillCount++;
		}
	}
}
