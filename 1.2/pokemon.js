class Pokemon {
    /**
     * @param {string} name
     * @param {number} level
     */
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

module.exports = Pokemon;