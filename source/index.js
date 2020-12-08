import { PokemonRom } from './PokemonRom';

const args   = process.argv.slice(2);
const [source,] = args;

let rom = new PokemonRom(source);

rom.preload().then((buffer)=>{

	// rom.lzDecompress();

	// return;

	// // title

	// rom.segment('title').then((buffer) => {
	// 	console.log(buffer.toString());
	// });

	// // elements

	rom.piece(0x27DE4, 0x27E49).then((buffer) => {
		// console.log( rom.decodeText(buffer) );
	});

	rom.listPokemon().then(pokemon => {
		let pokemonPromises = pokemon.map(pokemon => {
			if(!pokemon.number)
			{
				return Promise.resolve(false);
				return Promise.resolve({
					type:    'UNKNOWN'
					, feet:   0
					, inches: 0
					, pounds: 0
					, text:   '???'
				});
			}

			return new Promise((accept, reject) => {
				rom.pokemonName(pokemon.index).then((name) => {
				
					rom.pokedexEntry(pokemon.index).then((entry) => {
						pokemon.entry = entry;

						rom.pokemonInfo(pokemon.number).then((info) => {
							pokemon.info = info;

							accept(pokemon);
						});
					});
				});
			});
		});

		Promise.all(pokemonPromises).then(pokemon => {
			
			console.log(JSON.stringify(pokemon, null, 2));
			return;
			
			for(let i in pokemon)
			{

				if(!pokemon[i])
				{
					continue;
				}

				console.log(
					`#${pokemon[i].number.toFixed(0).padStart(3, '0')} ${pokemon[i].species} - ${pokemon[i].entry.type} [${pokemon[i].index}]
	Height: ${pokemon[i].entry.feet}' ${pokemon[i].entry.inches}"
	Weight: ${pokemon[i].entry.pounds} lbs
	${pokemon[i].entry.text.replace(/(^_|_$)/g, '')
		.replace(/_/g, ' ')
		+ '.'
	}

	HP:      ${pokemon[i].info.hp}
	Attack:  ${pokemon[i].info.attack}
	Defense: ${pokemon[i].info.defense}
	Speed:   ${pokemon[i].info.speed}
	Special: ${pokemon[i].info.special}
	
	Type 1:  ${pokemon[i].info.type1}
	Type 2:  ${pokemon[i].info.type2}

	Base Experience Yield: ${pokemon[i].info.expYield}

	Size of Front Sprite: ${pokemon[i].info.frontSpriteSize}
	
	Front Sprite: 0x${pokemon[i].info.frontSprite.toString(16)}
	Back Sprite:  0x${pokemon[i].info.backSprite.toString(16)}

	Basic Move 1: ${pokemon[i].info.basiceMove1}
	Basic Move 2: ${pokemon[i].info.basiceMove2}
	Basic Move 3: ${pokemon[i].info.basiceMove3}
	Basic Move 4: ${pokemon[i].info.basiceMove4}
`
				);
			}
		});
	});
});
