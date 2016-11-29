class UserRepository {
    constructor() {
        this.lastId = 0;
        this.storage = {};
    }

    /**
     * @param {User} user
     * @return {int}
     */
    insert(user) {
        this.lastId++;
        user.id = this.lastId;
        this.storage[user.id] = user;
    }

    /**
     * @param id
     * @return {User}|null
     */
    fetch(id) {
        if (!this.storage[id]) {
            return null;
        } else {
            return this.storage[id];
        }
    }

    fetchAll() {
        return Object.keys(this.storage).map(key => this.storage[key]);
    }

    /**
     * @param {int} id
     * @param {User} user
     * @return {boolean}
     */
    replace(id, user) {
        if (!this.storage[id]) {
            return false;
        } else {
            this.storage[id] = user;
            return true;
        }
    }

    /**
     * @param id
     * @return {boolean}
     */
    remove(id) {
        if (!this.storage[id]) {
            return false;
        } else {
            delete this.storage[id];
            return true;
        }
    }
}

module.exports = UserRepository;