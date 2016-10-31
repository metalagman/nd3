class Pokemon {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    show() {
        console.log(`Name: ${this.name} Level: ${this.level}`)
    }

    valueOf() {
        return this.level;
    }
}

class PokemonList extends Array {
    add(name, level) {
        this.push(new Pokemon(name, level));
    }

    show() {
        console.log(`Items count: ${this.length}`);
        this.forEach(v => v.show());
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

var lost = new PokemonList();
var found = new PokemonList();

lost.add('Test1', 1);
lost.add('Test2', 2);
lost.add('Test3', 3);

found.add('Test4', 4);
found.add('Test5', 5);

console.log('Lost list:');
lost.show();
console.log('Found list:');
found.show();

var {name, level} = lost.shift();
found.add(name, level);
console.log('Lost list:');
lost.show();
console.log('Found list:');
found.show();

console.log('Max in lost list:');
lost.max().show();
console.log('Max in found list:');
found.max().show();



