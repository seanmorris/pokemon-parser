import { PokemonRom } from './PokemonRom';

const args   = process.argv.slice(2);
const [source,] = args;

let rom = new PokemonRom(source);

rom.preload().then((buffer)=>{

	// process.stdout.write( rom.deref(220252, null, 565) );
	// rom.rleDecompress(220252, 565);
	// return;

	// // title

	// rom.segment('title').then((buffer) => console.log(
	// 	Array.from(buffer).map(byte => String.fromCharCode(byte)).join('')
	// ));
	// return;

	rom.getAllPokemon().then(allPokemon => {
		allPokemon = allPokemon.filter(a => a.number).sort((a,b)=>{
			return a.number - b.number;
		});

		// allPokemon.map(p => {
		// 	rom.getLevelUpActions(p.index).then(actions => {
		// 		console.log(`${ p.name } [${p.index+1}]	${ JSON.stringify(actions) }`)
		// 	});
		// });

		process.stdout.write(JSON.stringify(allPokemon, null, 4) + "\n");
	});
});
