'use strict';

var _PokemonRom = require('./PokemonRom');

var rom = new _PokemonRom.PokemonRom('/home/sean/PokemonRed.gb');

rom.preload().then(function (buffer) {

	// // title

	// rom.segment('title').then((buffer) => {
	// 	console.log(buffer.toString());
	// });

	// // elements

	// rom.piece(0x27DE4, 0x27E49).then((buffer) => {
	// 	console.log( rom.decodeText(buffer) );
	// });

	rom.listPokemon().then(function (pokemon) {
		var pokemonPromises = pokemon.map(function (pokemon) {
			if (!pokemon.number) {
				return Promise.resolve(false);
				// return Promise.resolve({
				// 	type:    'UNKNOWN'
				// 	, feet:   0
				// 	, inches: 0
				// 	, pounds: 0
				// 	, text:   '???'
				// });
			}

			return new Promise(function (accept, reject) {
				rom.pokemonName(pokemon.index).then(function (name) {

					rom.pokedexEntry(pokemon.index).then(function (entry) {
						pokemon.entry = entry;

						rom.pokemonInfo(pokemon.number).then(function (info) {
							pokemon.info = info;

							accept(pokemon);
						});
					});
				});
			});
		});

		Promise.all(pokemonPromises).then(function (pokemon) {
			for (var i in pokemon) {
				if (!pokemon[i]) {
					continue;
				}

				console.log('#' + pokemon[i].number.toFixed(0).padStart(3, '0') + ' ' + pokemon[i].species + ' - ' + pokemon[i].entry.type + ' [' + pokemon[i].index + ']\n\tHeight: ' + pokemon[i].entry.feet + '\' ' + pokemon[i].entry.inches + '"\n\tWeight: ' + pokemon[i].entry.pounds + ' lbs\n\t' + (pokemon[i].entry.text.replace(/(^_|_$)/g, '').replace(/_/g, ' ') + '.') + '\n\n\tHP:      ' + pokemon[i].info.hp + '\n\tAttack:  ' + pokemon[i].info.attack + '\n\tDefense: ' + pokemon[i].info.defense + '\n\tSpeed:   ' + pokemon[i].info.speed + '\n\tSpecial: ' + pokemon[i].info.special + '\n\t\n\tType 1:  ' + pokemon[i].info.type1 + '\n\tType 2:  ' + pokemon[i].info.type2 + '\n\n\tBase Experience Yield: ' + pokemon[i].info.expYield + '\n\n\tSize of Front Sprite: ' + pokemon[i].info.frontSpriteSize + '\n\t\n\tFront Sprite: 0x' + pokemon[i].info.frontSprite.toString(16) + '\n\tBack Sprite:  0x' + pokemon[i].info.backSprite.toString(16) + '\n\n\tBasic Move 1: ' + pokemon[i].info.basiceMove1 + '\n\tBasic Move 2: ' + pokemon[i].info.basiceMove2 + '\n\tBasic Move 3: ' + pokemon[i].info.basiceMove3 + '\n\tBasic Move 4: ' + pokemon[i].info.basiceMove4 + '\n');
			}
		});
	});
});