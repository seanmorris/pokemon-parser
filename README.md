# pokemon-parser
**v0.0.5c**

Parses pokedex, evolution & level-up move data directly from Pokemon Red/Blue roms.

## Motivation

I got tired of looking up this information in online indexes and finding incorrect information. Rather than try to memorize it, I'd rather get it right from the source.

## Usage

### Installation

```bash
$ npm install pokemon-parser --save
```

### Library

#### Load pokedex info for a given pokemon:

```javascript
const rom = new PokemonRom(PATH_TO_ROM || BUFFER_CONTAINING_ROM);

rom.preload().then(() => rom.getAllIndexNumbers()).then(numbers => {

	const dexNumber = numbers[ number ];

	return rom.getPokemon(dexNumber);

}).then(pokedexInfo => {

	console.log(pokedexInfo);

});

```

#### Load raw image data for pokemon:

The data will be returned as a list of 8-bit greyscale values for the pixels in the image, from left to right, starting from the top left corner.

You'll need to encode this data into an image or draw it to a canvas to display it.

```javascript
const rom = new PokemonRom(PATH_TO_ROM || BUFFER_CONTAINING_ROM);

rom.preload().then(() => rom.getAllIndexNumbers()).then(numbers => {

	const dexNumber = numbers[ number ];

	//return rom.getBackSprite( numbers[ number ] );
	return rom.getFrontSprite( numbers[ number ] );

}).then(imgBuffer => {

	console.log(imgBuffer); // Raw 8-bit greyscale

});

```

### CLI

```bash
$ npm i -g pokemon-parser
```

#### Get the sprites for a pokemon:

The `pic` command will print a PNG image of the pokemon's sprite to `STDOUT`.

```bash
$ pokemon-parser ~/PokemonRed.gb pic 6 > charizard-front.png
$ pokemon-parser ~/PokemonRed.gb pic-back 6 > charizard-back.png
```

![Charizard front sprite fron Generation 1](https://raw.githubusercontent.com/seanmorris/PokemonExtrator/master/charizard-front.png)
![Charizard back sprite fron Generation 1](https://raw.githubusercontent.com/seanmorris/PokemonExtrator/master/charizard-back.png)

#### Get all pokedex info:

The `dex` command will print a JSON stanza of pokedex info to `STDOUT`.


```bash
$ pokemon-parser ~/PokemonRed.gb dex
```

```javascript
[
    {
        "name": "BULBASAUR",
        "number": 1,
        "index": 152,
        "types": [
            "GRASS",
            "POISON"
        ],
        "dex": {
            "type": "SEED",
            "feet": 2,
            "inches": 4,
            "pounds": 15,
            "entry": "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON"
        },
        "evolutions": [
            {
                "name": "IVYSAUR",
                "type": "Level",
                "level": 16,
                "index": 9,
                "number": 2
            }
        ],
        "stats": {
            "hp": 45,
            "attack": 49,
            "defense": 49,
            "speed": 45,
            "special": 65,
            "catchRate": 45,
            "expYield": 64
        },
        "sprites": {
            "front": {
                "bank": 12,
                "pointer": 16384,
                "offset": 196608,
                "length": 85
            },
            "back": {
                "bank": 12,
                "pointer": 16613,
                "offset": 196837
            }
        },
        "basicMoves": [
            {
                "moveId": 32,
                "move": "TACKLE"
            },
            {
                "moveId": 44,
                "move": "GROWL"
            }
        ],
        "levelUpMoves": [
            {
                "moveId": 72,
                "move": "LEECH SEED",
                "level": 7
            },
            {
                "moveId": 21,
                "move": "VINE WHIP",
                "level": 13
            },
            {
                "moveId": 76,
                "move": "POISONPOWDER",
                "level": 20
            },
            {
                "moveId": 74,
                "move": "RAZOR LEAF",
                "level": 27
            },
            {
                "moveId": 73,
                "move": "GROWTH",
                "level": 34
            },
            {
                "moveId": 78,
                "move": "SLEEP POWDER",
                "level": 41
            },
            {
                "moveId": 75,
                "move": "SOLARBEAM",
                "level": 48
            }
        ]
    },
    // ...
]
```

#### Get pokedex info for a single pokemon:

Supply a number after the "dex" command to load data for one pokemon.

```bash
$ pokemon-parser ~/PokemonRed.gb dex 25
```

```json
{
    "name": "PIKACHU",
    "number": 25,
    "index": "83",
    "types": [
        "ELECTRIC"
    ],
    "dex": {
        "type": "MOUSE",
        "feet": 1,
        "inches": 4,
        "pounds": 13,
        "entry": "When several of these POKéMON gather, their electricity could build and cause lightning storms"
    },
    "evolutions": [
        {
            "name": "RAICHU",
            "type": "Stone",
            "level": 1,
            "index": 85,
            "number": 26,
            "item": 33
        }
    ],
    "stats": {
        "hp": 35,
        "attack": 55,
        "defense": 30,
        "speed": 90,
        "special": 50,
        "catchRate": 190,
        "expYield": 82
    },
    "sprites": {
        "front": {
            "bank": 11,
            "pointer": 19837,
            "offset": 183677,
            "length": 85
        },
        "back": {
            "bank": 11,
            "pointer": 20107,
            "offset": 183947
        }
    },
    "basicMoves": [
        {
            "moveId": 83,
            "move": "THUNDERSHOCK"
        },
        {
            "moveId": 44,
            "move": "GROWL"
        }
    ],
    "levelUpMoves": [
        {
            "moveId": 85,
            "move": "THUNDER WAVE",
            "level": 9
        },
        {
            "moveId": 97,
            "move": "QUICK ATTACK",
            "level": 16
        },
        {
            "moveId": 128,
            "move": "SWIFT",
            "level": 26
        },
        {
            "moveId": 96,
            "move": "AGILITY",
            "level": 33
        },
        {
            "moveId": 86,
            "move": "THUNDER",
            "level": 43
        }
    ]
}
```

## Developing

### Build

Build with `make`

```bash
$ make
```

### Run it

Run the resulting index file in node:

```bash
$ node index.js ~/pokemon-red.gb
```

## TODO

* Load TM/HM move learnsets.
* Load encounter locations.
* Load color palette for pokemon when producing PNGs for sprites.
* Account for edge case involving locations for Mew's stats & sprite locations.
* Use pointer instead of fixed addresses to account for Pokemon Yellow, and possibly rom hacks.
* Write code to load similar data for Gen II.

