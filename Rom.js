import fs from 'fs';

export class Rom
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
