# pokemon-parser
**v0.0.2**

Parses pokedex, evolution & level-up move data directly from Pokemon Red/Blue roms.

## Motivation

I got tired of looking up this information in online indexes and finding incorrect information. Rather than try to memorize it, I'd rather get it right from the source.

## Build

Build with `make`

```bash
$ make
```
## Usage

Run the resulting index file in node:

```bash
$ node index.js ~/pokemon-red.gb
```
output

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
