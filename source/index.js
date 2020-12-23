#!/usr/bin/env node

import { PokemonRom } from './PokemonRom';

const args   = process.argv.slice(2);
const [source,pokemonNumber] = args;

const rom = new PokemonRom(source);

if(pokemonNumber)
{
	rom.preload().then((buffer)=> {

		return rom.getAllIndexNumbers();

	}).then(numbers => {

		return rom.getPokemon( numbers[ pokemonNumber ] );

	}).then(pokemon => {

		process.stdout.write(JSON.stringify(pokemon, null, 4) + "\n");

	});
}
else
{
	rom.preload().then((buffer)=> {

		return rom.getAllPokemon();

	}).then(allPokemon => {

		allPokemon = allPokemon.filter(a => a.number).sort((a,b)=>{
			return a.number - b.number;
		});

		process.stdout.write(JSON.stringify(allPokemon, null, 4) + "\n");

	});
}
