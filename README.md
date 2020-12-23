# pokemon-parser
**v0.0.3**

Parses pokedex, evolution & level-up move data directly from Pokemon Red/Blue roms.

## Motivation

I got tired of looking up this information in online indexes and finding incorrect information. Rather than try to memorize it, I'd rather get it right from the source.

## Installation

```bash
$ npm i -g pokemon-parser
```

## Usage

#### Get all pokedex info:

```bash
$ pokemon-parser ~/PokemonRed.gb
```

```js
[
    {
        "name": "BULBASAUR",
        "number": 1,
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
        "index": 152,
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
            "type1": 22,
            "type2": 3,
            "catchRate": 45,
            "expYield": 64,
            "frontSpriteSize": 85,
            "frontSprite": {
                "bank": 12,
                "pointer": 16384,
                "offset": 196608
            },
            "backSprite": {
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

```bash
$ pokemon-parser ~/PokemonRed.gb 5
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
