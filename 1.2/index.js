"use strict";
const hs = require('./hidenseek');
const fs = require('fs');
const PokemonList = require('./pokemonlist');
const Pokemon = require('./pokemon');

let mode = process.argv[2];

let help = () => {
    console.log('Valid commands:\n\n' +
        'node index hide ./field/ ./pokemons.json\n' +
        'node index seek ./field/'
    );
};

switch (mode) {
    case 'hide':
        let json = require(process.argv[4]);
        let list = new PokemonList();
        json.forEach(item => {
            let {name, level} = item;
            list.add(name, level);
        });
        hs.hide(process.argv[3], list).then(list => {
            list.show();
        });
        break;
    case 'seek':
        hs.seek(process.argv[3]).then(list => {
            list.show();
        });
        break;
    case undefined:
        help();
        break;
    default:
        console.error('Unknown command: ' + mode);
}