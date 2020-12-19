import { BitArray } from '../BitArray';

export class Merge
{
	constructor(input, width)
	{
		console.log(input);

		this.width  = width;
		this.size   = input.length;
		this.input  = new BitArray(input);
		this.buffer = new Uint8Array(width**2);
	}

	decompress()
	{
		const pallet = [255,128,196,64];
		const halfLength = this.input.length / 2;

		console.log(this.input);

		for(let i = 0; i < halfLength; i++)
		{
			const b1 = this.input.get(this.pixelToRowPixel(i));
			const b2 = this.input.get(this.pixelToRowPixel(i)+this.width**2);
			const b  = b1 << 1 | b2;

			this.buffer[i] = pallet[b];
		}
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
