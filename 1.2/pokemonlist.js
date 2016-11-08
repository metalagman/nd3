const Pokemon = require('./pokemon');

class PokemonList extends Array {
    /**
     * @param {string} name
     * @param {number} level
     */
    add(name, level) {
        this.push(new Pokemon(name, level));
    }

    show() {
        console.log(`Items count: ${this.length}`);
        this.forEach(item => {
            item.show()
        });
    }

    max() {
        if (this.length == 0) {
            return null;
        }
        var byLevel = this.slice(0);
        byLevel.sort((a, b) => b - a);
        return byLevel[0];
    }
}

module.exports = PokemonList;