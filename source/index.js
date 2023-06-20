#!/usr/bin/env node

const fs  = require("fs");

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
	case 'sprites':

		loaded
		.then(() => rom.getSprites())
		.then(spriteChunks => {

			console.log(spriteChunks);

			for(const i in spriteChunks)
			{
				const spriteData = spriteChunks[i];

				const PNG = require("pngjs").PNG;

				if(!PNG)
				{
					throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
				}

				const png = new PNG({width: 16, height: Math.ceil(spriteData.length / 128), filterType: 1});

				png.data = spriteData;

				const blockFile = `sprites-yellow-${i}-exported.png`;

				png.pack().pipe(fs.createWriteStream('./' + blockFile));
			}

		});

		break;

	case 'maps':

		loaded
		.then(() => rom.getAllMaps())
		.then(([maps,tilesets]) => {

			const tilesBySet = {};

			maps.forEach((map, mapIndex) => {

				if(!map.renderedBlocks)
				{
					return;
				}

				const tilesetFile = `tileset-${map.tilesetId}.png`;
				const mapName     = `map-${String(mapIndex).padStart(2,'0')}`;
				const mapFile     = `maps/yellow/${mapName}.json`;
				const blockFile   = `${mapName}_blocks-${map.tilesetId}.png`;

				const tileIds  = Object.keys(map.renderedTiles);

				for(const tileIndex in tileIds)
				{
					const tileId = tileIds[tileIndex];

					const tile = map.renderedTiles[tileId];

					tilesBySet[map.tilesetId] = tilesBySet[map.tilesetId] || {};

					tilesBySet[map.tilesetId][tileId] = tile;
				}

				const blockIds = Object.keys(map.renderedBlocks);

				const localBlockIds = Object.fromEntries(blockIds.map((v,k) => {return [v,k]}));

				const PNG = require("pngjs").PNG;

				if(!PNG)
				{
					throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
				}

				const png = new PNG({width: 32, height: blockIds.length * 32, filterType: 1});
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

				for(const blockIndex in map.blockIds)
				{
					const blockId = map.blockIds[blockIndex];

					map.blockPlane[ blockIndex ] = -1 + localBlockIds[blockId];
				}

				// console.log( map.blockPlane );
				// process.exit();

				const mapData = TiledMap(
					mapName
					, [...map.tilePlane]
					, [...map.solidPlane]
					, tilesetFile
					, map.width*4
					, map.height*4
					, 8
				);

				// const mapData = TiledMap(
				// 	mapName
				// 	, [...map.blockPlane]
				// 	, [...map.blockPlane]
				// 	, blockFile
				// 	, map.width
				// 	, map.height
				// 	, 32
				// );

				fs.writeFile(mapFile, JSON.stringify(mapData, null, 4), error => {
					if(error)
					{
						console.error(error)
						return
					}
				});

				if(png.data.length)
				{
					png.pack().pipe(fs.createWriteStream('maps/yellow/' + blockFile));
				}

			});

			Object.keys(tilesBySet).forEach(tilesetIndex => {
				const PNG = require("pngjs").PNG;

				if(!PNG)
				{
					throw new Error("Library \"PNGJS\" is required to produce PNGs!\nSee https://www.npmjs.com/package/pngjs for more info.");
				}
				const tileset   = tilesBySet[tilesetIndex];
				const maxTileId = 1+Math.max(...Object.keys(tileset));

				const png = new PNG({width: 8, height: maxTileId * 8, filterType: 1});
				png.data = new Uint8Array(maxTileId * 8 * 8 * 4);

				for(const tileIndex in tileset)
				{
					const tile = tileset[tileIndex];

					for(const inPixel in tile)
					{
						const outPixel = tileIndex * 8 * 8 * 4 + inPixel * 4;

						const color = tile[inPixel];

						png.data[outPixel+0] = 255 + -80 * color;
						png.data[outPixel+1] = 255 + -80 * color;
						png.data[outPixel+2] = 255 + -80 * color;
						png.data[outPixel+3] = 255;
					}
				}

				const file = `tileset-${tilesetIndex}.png`;

				png.pack().pipe(fs.createWriteStream('maps/yellow/' + file));
			});

			// console.log(tilesBySet);
		});

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

				rom.getPokemon(dexNumber)
				.then(pokemon => process.stdout.write(JSON.stringify(pokemon, null, 4) + "\n"));
			}
			else
			{
				rom.getAllPokemon().then(allPokemon => {
					allPokemon = allPokemon
					.filter(a => a.number)
					.sort((a,b)=> a.number - b.number);

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
