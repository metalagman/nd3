const fs = require('fs');
const crypto = require('crypto');
const stream = require('stream');

class Hasher extends stream.Transform {
    constructor(algo, options) {
        super(options)
        this.hash = crypto.createHash(algo);
    }
    _transform(chunk, encoding, callback) {
        // updating current hash
        this.hash.update(chunk);
        callback();
    }
    _flush(callback) {
        // pushing hash value to the next consumer
        this.push(this.hash.digest('hex'));
        callback();
    }
}

let input = fs.createReadStream('source.txt');
let output = fs.createWriteStream('part2.txt.md5');
let hasher = new Hasher('md5');

input.pipe(hasher).pipe(output);
input.pipe(hasher).pipe(process.stdout);