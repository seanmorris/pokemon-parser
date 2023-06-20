export class Gameboy2bpp
{
	outputPos  = 0;
	inputPos   = 0;

	tileWidth  = 8;
	tileHeight = 8;
	depth      = 2;

	constructor(inputBuffer, outputBuffer, width)
	{
		this.inputBuffer  = inputBuffer;
		this.outputBuffer = outputBuffer;

		this.width = width;
	}

	next()
	{
		if(this.inputPos >= this.inputBuffer.length)
		{
			return;
		}

		const palette  = [
			[0xFF, 0xFF, 0xFF]
			, [0x55, 0x55, 0x55]
			, [0xAA, 0xAA, 0xAA]
			, [0x00, 0x00, 0x00]
		];

		const byteA = this.inputBuffer[this.inputPos++];
		const byteB = this.inputBuffer[this.inputPos++];

		const maxTilesX = Math.floor(this.width / this.tileWidth);

		const bitPairs = [
			(((byteA & 0b10000000) << 1) | (byteB & 0b10000000)) >> 7
			, (((byteA & 0b01000000) << 1) | (byteB & 0b01000000)) >> 6
			, (((byteA & 0b00100000) << 1) | (byteB & 0b00100000)) >> 5
			, (((byteA & 0b00010000) << 1) | (byteB & 0b00010000)) >> 4
			, (((byteA & 0b00001000) << 1) | (byteB & 0b00001000)) >> 3
			, (((byteA & 0b00000100) << 1) | (byteB & 0b00000100)) >> 2
			, (((byteA & 0b00000010) << 1) | (byteB & 0b00000010)) >> 1
			, (((byteA & 0b00000001) << 1) | (byteB & 0b00000001)) >> 0
		];

		const tileArea = this.tileWidth * this.tileHeight;

		for(const j in bitPairs)
		{
			const currentTile  = Math.floor(this.outputPos / tileArea);
			const currentTileX = currentTile % maxTilesX;
			const currentTileY = Math.floor(currentTile / maxTilesX);

			const fromTile     = this.outputPos % tileArea;
			const fromTileY    = Math.floor(fromTile / this.tileWidth);
			const fromTileX    = fromTile % this.tileWidth;

			const fromOriginX = (currentTileX * this.tileWidth) + fromTileX;
			const fromOriginY = (currentTileY * this.tileHeight) + fromTileY;

			const address = maxTilesX * this.tileWidth * fromOriginY + fromOriginX;

			this.outputBuffer[address * 4 + 0] = palette[ bitPairs[j] ][0];
			this.outputBuffer[address * 4 + 1] = palette[ bitPairs[j] ][1];
			this.outputBuffer[address * 4 + 2] = palette[ bitPairs[j] ][2];
			this.outputBuffer[address * 4 + 3] = 255;

			this.outputPos++;
		}

		return this.outputPos * 4 < this.outputBuffer.length;
	}
}
