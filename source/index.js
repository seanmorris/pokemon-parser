#!/usr/bin/env node

import { PokemonRom } from './PokemonRom';
import { TiledMap } from './TiledMap';

const args = process.argv.slice(2);

const [source, action, ...query] = args;

const [number,] = query;

if(Number(action) == action)
{
	number = action;
	action = 'dex';
}

const rom    = new PokemonRom(source);
const loaded = rom.preload();

let color = false;

switch(action)
{
	case 'maps':
		loaded
		.then(() => rom.getAllMaps())
		.then(maps => maps.forEach((map,mapIndex) => {

			if(!map.renderedBlocks)
			{
				return;
			}

			const blockIds = Object.keys(map.renderedBlocks);

			const PNG = require("pngjs").PNG;

			if(!PNG)
			{
				throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
			}

			const png = new PNG({width: 32, height: blockIds.length * 32, filterType: 1});
			const fs  = require("fs");

			png.data = new Uint8Array(blockIds.length * 32 * 32 * 4);

			const blockKey = {};

			for(const blockIndex in blockIds)
			{
				const blockId = blockIds[blockIndex];

				blockKey[blockId] = blockIndex;

				const block = map.renderedBlocks[blockId];

				for(const inPixel in block)
				{
					const outPixel = blockIndex * 32 * 32 * 4 + inPixel * 4;

					const color = block[inPixel];

					png.data[outPixel+0] = 255 + -80 * color;
					png.data[outPixel+1] = 255 + -80 * color;
					png.data[outPixel+2] = 255 + -80 * color;
					png.data[outPixel+3] = 255;
				}
			}

			const mapName = `map-${String(mapIndex).padStart(2,'0')}`;
			const mapFile = `maps/${mapName}.json`;

			const tilesetFile = `${mapName}_tileset-${map.tilesetId}.png`;

			png.pack().pipe(fs.createWriteStream('maps/' + tilesetFile));

			const mapData = TiledMap(
				[...map.blockIds.map(b => 1 + Number(blockKey[b]))]
				, tilesetFile
				, map.width
				, map.height
			);

			fs.writeFile(mapFile, JSON.stringify(mapData), error => {
				if(error)
				{
					console.error(error)
					return
				}
			});

		}));
		break;
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

	case 'pic-back-color':
	case 'pic-color':
		color = true;
	case 'pic-back':
	case 'pic':
		loaded.then((buffer)=> {

			const getIndex = rom.getAllIndexNumbers();
			const getPalettes = rom.getAllPalettes();

			return Promise.all([getIndex, getPalettes]);

		}).then(([index, palettes]) => {

			const indexNumber = index[ number ];

			const getPaletteIndex = rom.getAllPokemonPalettes();

			return Promise.all([indexNumber, palettes, getPaletteIndex]);

		}).then(([indexNumber, palettes, paletteIndex]) => {
			const paletteId = paletteIndex[number-1];
			const palette   = palettes[paletteId];

			const getPixels = (action == 'pic' || action == 'pic-color')
				? rom.getFrontSprite(indexNumber)
				: rom.getBackSprite(indexNumber);

			return Promise.all([indexNumber, getPixels, palette]);

		}).then(([indexNumber, pixels, palette]) => {

			const size = Math.sqrt(pixels.length);
			const PNG  = require("pngjs").PNG;

			if(!PNG)
			{
				throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
			}

			const png  = new PNG({width: size, height: size, filterType: 1});

			png.data = new Uint8Array(pixels.length * 4);

			for(let inPixel in pixels)
			{
				const outPixel = inPixel * 4;

				let r,g,b;

				if(color && palette)
				{
					if(pixels[inPixel] === 255)
					{
						r = palette[0].r * 8;
						g = palette[0].g * 8;
						b = palette[0].b * 8;
					}
					else if(pixels[inPixel] === 196)
					{
						r = palette[1].r * 8;
						g = palette[1].g * 8;
						b = palette[1].b * 8;
					}
					else if(pixels[inPixel] === 128)
					{
						r = palette[2].r * 8;
						g = palette[2].g * 8;
						b = palette[2].b * 8;
					}
					else if(pixels[inPixel] === 64)
					{
						r = palette[3].r * 8;
						g = palette[3].g * 8;
						b = palette[3].b * 8;
					}
				}

				png.data[outPixel+0] = r || pixels[inPixel];
				png.data[outPixel+1] = g || pixels[inPixel];
				png.data[outPixel+2] = b || pixels[inPixel];
				png.data[outPixel+3] = 255;
			}

			png.pack().pipe(process.stdout);

		});
		break;

	default:
		throw new Error(`Command "${action}" not found.`);
		break;
}
