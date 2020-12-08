# Pokemon Parser
**v0.0.1**

Parses pokedex data directly from Pokemon Red/Blue roms.

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
    "number": 1,
    "index": 152,
    "species": "BULBASAUR",
    "entry": {
      "type": "SEED",
      "feet": 2,
      "inches": 4,
      "pounds": 15,
      "text": "_A strange seed was_planted on its_back at birth._The plant sprouts_and grows with_this POKéMON_"
    },
    "info": {
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
      "frontSprite": 16384,
      "backSprite": 16613,
      "basiceMove1": 33,
      "basiceMove2": 45,
      "basiceMove3": 0,
      "basiceMove4": 0
    }
  },
  {
    "number": 2,
    "index": 8,
    "species": "IVYSAUR",
	// ...
  }
// ...
]
```