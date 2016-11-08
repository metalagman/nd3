"use strict";
const fs = require('fs');
const Pokemon = require('./pokemon');
const PokemonList = require('./pokemonlist');

/**
 * @param {string} path
 * @param {PokemonList} list
 * @return {Promise}
 */
const hide = (path, list) => {
    list = shuffle(list);
    let selected = new PokemonList();
    for (let i = 1; i <= 3 && list.length > 0; i++) {
        selected.push(list.shift());
    }
    return (new Promise((resolve, reject) => {
        let result = [];
        for (let i = 1; i<=10; i++) {
            let dir = path + '/' + ("0" + i).slice(-2);
            try {
                fs.mkdirSync(dir);
            } catch(e) {
                if ( e.code != 'EEXIST' ) reject(e);
            }
            result.push(dir);
        }
        resolve(result);
    })).then(dirs => {
        dirs = shuffle(dirs);
        dirs = dirs.slice(0, 3);
        dirs.forEach((dir, index) => {
            let p = selected[index];
            fs.writeFile(dir + '/pokemon.txt', `${p.name}|${p.level}`);
        });
    }).then(() => selected);
};

/**
 * @param {string} path
 * @return {Promise}
 */
const seek = (path) => {
    return getSubDirectories(path).then(items => {
        let all = [];
        items.forEach(item => {
            all.push(new Promise((resolve, reject) => {
                let check = item + '/pokemon.txt';
                fs.stat(check, (err, stats) => {
                    if (err) {
                        resolve(null);
                        return;
                    }
                    if (stats != undefined && stats.isFile()) {
                        resolve(check);
                    } else {
                        resolve(null);
                    }
                })
            }))
        });
        return Promise.all(all);
    }).then(items => {
        return items.filter(items => items != null);
    }).then(items => {
        let all = [];
        items.forEach(item => {
            all.push(new Promise((resolve, reject) => {
                fs.readFile(item, 'utf8', (err, data) => {
                    let [name, level] = data.split('|', 2);
                    let p = new Pokemon(name, level);
                    resolve(p);
                })
            }));
        });
        return Promise.all(all);
    }).then(items => {
        let list = new PokemonList();
        items.forEach(item => list.push(item));
        return list;
    });
};

/**
 * @param {string} path
 * @returns {Promise}
 */
const readDir = path => {
    return new Promise(resolve => {
        let result = [];
        fs.readdir(path, function(err, items) {
            resolve(items);
        });
    });
};

/**
 *
 * @param {string} path
 */
const getSubDirectories = (path) => {
    return readDir(path).then(items => {
        var all = [];
        items.forEach(item => {
            all.push(new Promise((resolve, reject) => {
                let check = path + '/' + item;
                fs.stat(check, (err, stats) => {
                    if (err) {
                        reject(err);
                    }
                    if (stats.isDirectory()) {
                        resolve(check);
                    } else {
                        resolve(null);
                    }
                })
            }));
        });
        return Promise.all(all);
    }).then(items => {
        return items.filter(items => items != null);
    });
};

const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

module.exports = {
    hide,
    seek
};