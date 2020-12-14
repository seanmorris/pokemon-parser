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
        "name": "BULBASAUR",
        "number": 1,
        "index": 190,
        "dex": {
            "type": "SEED",
            "feet": 2,
            "inches": 4,
            "pounds": 15,
            "entry": "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON"
        },
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
            },
            "basiceMove1": 33,
            "basiceMove2": 45,
            "basiceMove3": 0,
            "basiceMove4": 0
        }
    },
    {
        "name": "IVYSAUR",
        "number": 2,
        "index": 190,
        "dex": {
            "type": "SEED",
            "feet": 3,
            "inches": 3,
            "pounds": 29,
            "entry": "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs"
        },
        "stats": {
            "hp": 60,
    // ...
```