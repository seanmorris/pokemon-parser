#!/usr/bin/env node

import { PokemonRom } from './PokemonRom';

const args = process.argv.slice(2);

let [source,action,number] = args;

if(Number(action) == action)
{
	number = action;
	action = 'dex';
}

const rom    = new PokemonRom(source);
const loaded = rom.preload();

switch(action)
{
	case 'dex':
		loaded.then(() => rom.getAllIndexNumbers()).then(numbers => {

			if(number)
			{
				const dexNumber = numbers[ number ];

				if(!dexNumber)
				{
					return;
				}

				rom.getPokemon(dexNumber).then(pokemon => {

					process.stdout.write(JSON.stringify(pokemon, null, 4) + "\n");

				});
			}
			else
			{
				rom.getAllPokemon().then(allPokemon => {

					allPokemon = allPokemon.filter(a => a.number).sort((a,b)=>{
						return a.number - b.number;
					});

					process.stdout.write(JSON.stringify(allPokemon, null, 4) + "\n");

				});
			}

		});
		break;

	case 'pic':
	case 'pic-back':
		loaded.then((buffer)=> {

			return rom.getAllIndexNumbers();

		}).then(numbers => {

			return action == 'pic'
				? rom.getFrontSprite( numbers[ number ] )
				: rom.getBackSprite( numbers[ number ] );

		}).then(bytes => {
			const size = Math.sqrt(bytes.length);
			const fs   = require("fs");
			const PNG  = require("pngjs").PNG;

			if(!PNG)
			{
				throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
			}

			const png  = new PNG({width: size, height: size, filterType: 1});

			png.data = new Uint8Array(bytes.length * 4);

			for(let inPixel in bytes)
			{
				const outPixel = inPixel * 4;

				png.data[outPixel+0] = bytes[inPixel];
				png.data[outPixel+1] = bytes[inPixel];
				png.data[outPixel+2] = bytes[inPixel];
				png.data[outPixel+3] = 255;
			}

			png.pack().pipe(process.stdout);

		});
		break;

	default:
		throw new Error(`Command "${action}" not found.`);
		break;

}
