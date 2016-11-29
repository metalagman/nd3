class User {
    constructor(name, score) {
        this.id = null;
        this.name = name;
        this.score = score;
    }

    validate() {
        return !(
            typeof this.name != 'string'
            || this.name.length == 0
            || typeof this.score != 'number'
        );
    }
}

module.exports = User;