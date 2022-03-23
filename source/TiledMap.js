export const TiledMap = (tiles, image, width, height) => ({
	"compressionlevel": -1,
	"height": height,
	"infinite": false,
	"layers":
	[
		{
			"data":tiles,
			"height": height,
			"id": 1,
			"name": "Tile Layer 1",
			"opacity": 1,
			"type": "tilelayer",
			"visible": true,
			"width": width,
			"x": 0,
			"y": 0
		}
	],
	"nextlayerid": 2,
	"nextobjectid": 1,
	"orientation": "orthogonal",
	"renderorder": "left-down",
	"tiledversion": "1.7.1",
	"tileheight": 32,
	"tilesets":
	[
		{
			"columns": 1,
			"firstgid": 1,
			"image": image,
			"imageheight": 896,
			"imagewidth": 32,
			"margin": 0,
			"name": "map-000_tileset-0",
			"spacing": 0,
			"tilecount": 28,
			"tileheight": 32,
			"tilewidth": 32
		}
	],
	"tilewidth": 32,
	"type": "map",
	"version": "1.6",
	"width": width
});
