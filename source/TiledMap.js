export const TiledMap = (name, tiles, collision, image, width, height, tileSize = 32) => {
	return {
		"compressionlevel": -1,
		"height": height,
		"infinite": false,
		"layers":
		[
			{
				"data":collision.map(t => t+1),
				"height": height,
				"id": 1,
				"name": "Collision 0",
				"opacity": 0.25,
				"type": "tilelayer",
				"visible": true,
				"width": width,
				"x": 0,
				"y": 0
			}
			, {
				"data": Array(collision.length).fill(0),
				"height": height,
				"id": 2,
				"name": "Collision 1",
				"opacity": 0.25,
				"type": "tilelayer",
				"visible": true,
				"width": width,
				"x": 0,
				"y": 0
			}
			, {
				"data": Array(collision.length).fill(0),
				"height": height,
				"id": 3,
				"name": "Collision 2",
				"opacity": 0.25,
				"type": "tilelayer",
				"visible": true,
				"width": width,
				"x": 0,
				"y": 0
			}
			, {
				"data":tiles.map(t => t+2),
				"height": height,
				"id": 4,
				"name": "Art",
				"opacity": 1,
				"type": "tilelayer",
				"visible": true,
				"width": width,
				"x": 0,
				"y": 0
			}
			, {
	            "draworder": "topdown",
	            "id": 5,
	            "name": "objects",
	            "objects":
	            [
	                {
	                    "height": 0,
	                    "id": 1,
	                    "name": "player-start",
	                    "point": true,
	                    "rotation": 0,
	                    "type": "player-start",
	                    "visible": true,
	                    "width": 0,
	                    "x": 0,
	                    "y": 0
	                }
	            ],
	            "opacity": 1,
	            "type": "objectgroup",
	            "visible": true,
	            "x": 0,
	            "y": 0
	        }
		],
		"nextlayerid": 2,
		"nextobjectid": 1,
		"orientation": "orthogonal",
		"renderorder": "left-down",
		"tiledversion": "1.7.1",
		"tileheight": tileSize,
		"tilesets":
		[
			{
				"columns": 1,
				"firstgid": 1,
				"image": 'solid.png',
				"imageheight": 16,
				"imagewidth": 8,
				"margin": 0,
				"name": name + "solid",
				"spacing": 0,
				"tilecount": 28,
				"tileheight": 8,
				"tilewidth": 8
			}
			, {
				"columns": 1,
				"firstgid": 3,
				"image": image,
				"imageheight": 896,
				"imagewidth": tileSize,
				"margin": 0,
				"name": name + '-' + image,
				"spacing": 0,
				"tilecount": 28,
				"tileheight": tileSize,
				"tilewidth": tileSize
			}
		],
		"tilewidth": tileSize,
		"type": "map",
		"version": "1.6",
		"width": width
	};
};
