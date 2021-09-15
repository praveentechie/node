// node: v12.13.1
const { Readable } = require('stream');
const fs = require('fs');

readStream();
writeStream();

/**
 * Basic read stream from genrator function `Readable.from`
 */
function readStream() {
  async function * generate() {
    yield 'hello';
    yield 'streams';
    yield null;
  }
  
  const readable = Readable.from(generate());
  
  readable.on('data', (chunk) => {
    console.log(chunk);
  });  
}
/**
 * Writing to file `createWriteStream`
 */
async function writeStream() {
  await fs.mkdirSync('./out');
  // Write 'hello, ' and then end with 'world!'.
  const file = fs.createWriteStream('./out/example.txt');
  file.write('hello, ');
  file.end('world!');
  // Writing more now is not allowed!
}
