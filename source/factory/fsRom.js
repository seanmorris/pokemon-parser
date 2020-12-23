import fs from 'fs';
import { Rom } from '../base/Rom';

export default function(filename)
{
	return new Promise((accept, reject) => {
		fs.exists(filename, (exists) => {
			if(!exists)
			{
				return reject('Rom file does not exist.');
			}

			fs.stat(filename, (error, stats) => {
				if(error)
				{
					return reject(error);
				}

				fs.open(filename, 'r', (error, handle) => {
					if(error)
					{
						return reject(error);
					}

					fs.read(
						handle
						, new Uint8Array(stats.size)
						, null
						, stats.size
						, 0
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
	});
}
