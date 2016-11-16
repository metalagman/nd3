const stream = require('stream');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Inf extends stream.Readable {
    _read(size) {
        this.push(getRandomInt(0, 9).toString());
    }
}

class Logger extends stream.Writable {
    _write(chunk, encoding, callback) {
        process.stdout.write(chunk.toString());
        callback();
    }
}

class Delay extends stream.Transform {
    _transform(chunk, encoding, callback) {
        setTimeout(() => {
            this.push(chunk.toString().toUpperCase());
            callback();
        }, 1000);
    }
}

let inf = new Inf();
let logger = new Logger();
let delay = new Delay();

inf.pipe(delay).pipe(logger);