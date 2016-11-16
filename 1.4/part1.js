const fs = require('fs');
const crypto = require('crypto');

let input = fs.createReadStream('part1.txt');
let output = fs.createWriteStream('part1.txt.md5');

let hash = crypto.createHash('md5');
hash.setEncoding('hex');

input.pipe(hash).pipe(output);