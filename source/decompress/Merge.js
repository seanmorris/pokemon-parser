import { BitArray } from '../BitArray';

export class Merge
{
	constructor(input, width)
	{
		this.width  = width;
		this.size   = input.length;
		this.input  = new BitArray(input);
		this.buffer = new Uint8Array(width**2);

		this.i = 0;
	}

	decompress()
	{
		while(this.iterate());
	}

	iterate()
	{
		const pallet = [255,128,196,64];
		const halfLength = this.input.length / 2;

		if(this.i < halfLength)
		{
			const b1 = this.input.get(this.pixelToRowPixel(this.i));
			const b2 = this.input.get(this.pixelToRowPixel(this.i)+this.width**2);
			const b  = b1 << 1 | b2;

			this.buffer[this.i] = pallet[b];

			this.i++;

			return true;
		}

		return false;
	}

	pixelToRowPixel(pixel)
	{
		const width  = this.width;
		const pEven  = pixel % 2 === 0;
		const xOff   = Math.floor(pixel / width);
		const xEven  = xOff % 2 == 0;
		const yOff   = pixel % width;

		const result = (xOff * 2 + yOff * width) + (pEven ? 0:-(width-1));

		return result;
	}
}
