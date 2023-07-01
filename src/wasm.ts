import { readFileSync } from 'node:fs';
const assert = require('node:assert');
// import { WASI } from 'wasi';
// import { argv, env } from 'node:process';

// const wasi = new WASI();

const memory = new WebAssembly.Memory({ initial: 1 });
const consoleLogString = (offset: number, length: number) => {
    var bytes = new Uint8Array(memory.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    console.log(string);
};

const importObject = {
    console: { log: consoleLogString },
    js: { mem: memory }
};

type Exports = {
    writeHi: (len: number, i: number) => void;
};

export const run = async () => {
    // const wasm = await WebAssembly.compile(readFileSync('./demo.wasm'));
    const instance = await WebAssembly.instantiate(readFileSync('./src/asm/uuid.wasm'), importObject);
    console.log(instance.instance.exports);
    const exp = instance.instance.exports as Exports;
    console.log(exp.writeHi);
    console.log(exp.writeHi(14, 10));
    // exp.logIt(12345);
    // wasi.start(instance);
};

// run().catch(console.error);

// JS loader and tester for the sample.
//
// Eli Bendersky [https://eli.thegreenplace.net]
// This code is in the public domain.

// Dumps a WebAssembly.Memory object's contents starting at `start`, for `len`
// bytes in groups of 16.
const memdump = (mem: WebAssembly.Memory, start: number, len: number) => {
    // console.log(mem.buffer);
    let view = new Uint8Array(mem.buffer);
    for (let i = 0; i < len; i++) {
        let index = start + i;
        process.stdout.write(`${view[index]!.toString(16).toUpperCase().padStart(2, '0')} `);
        if ((index + 1) % 16 === 0) {
            console.log();
        }
    }
    console.log();
};

type ExportsMem = {
    memory: WebAssembly.Memory;
    wasm_grow: (len: number) => number;
    wasm_size: () => number;
    wasm_fill: (start: number, val: number, n: number) => void;
    wasm_copy: (size: number, start: number, dest: number) => void;
    read_mem: (src: number) => number;
    orientate: () => void;
    parseInteger: (pointer: number) => number;
    isDigitCode: (code: number) => number;
    moreThan57: (code: BigInt) => number;
    parseHex: (pointer: number) => BigInt;
};

// const uuid = 'ece33fe4-1682-11ee-be56-0242ac120002';
// const buf = Buffer.from(uuid.replaceAll('-', ''), 'hex');

(async () => {
    // Load the WASM file and instantiate it.
    const bytes = readFileSync('./src/asm/uuid.wasm');
    let obj = await WebAssembly.instantiate(new Uint8Array(bytes));
    const exp = obj.instance.exports as ExportsMem;
    // Get wasm's memory and check its size.
    let mem = exp.memory as WebAssembly.Memory;
    assert.equal(mem.buffer.byteLength, 64 * 1024);
    console.log('first');
    memdump(mem, 0, 64);

    // Use wasm's own memory.grow to grow memory by 5 pages.
    let wasm_grow = exp.wasm_grow;
    let sz = wasm_grow(5);
    assert.equal(sz, 1);
    assert.equal(mem.buffer.byteLength, 6 * 64 * 1024);

    // The memory's contents are preserved after growing it.
    memdump(mem, 0, 64);

    // Now further grow memory from the host.
    mem.grow(3);
    assert.equal(mem.buffer.byteLength, 9 * 64 * 1024);
    memdump(mem, 0, 64);

    let wasm_size = exp.wasm_size;
    assert.equal(wasm_size(), 9);

    let wasm_fill = exp.wasm_fill;
    console.log(wasm_fill(16, 0x22, 8));
    memdump(mem, 0, 64);

    memdump(mem, 0, 64);

    // console.log(exp.wasm_copy(16, 0, 48));
    // for (let i = 0; i < 16; i++) console.log(i, exp.read_mem(i));
    exp.orientate();

    const bb = Buffer.from('1ee1682ece33fe4');

    wasm_fill(0, 0, 64);
    memdump(mem, 0, 64);
    for (let i = 0; i < bb.length; i++) wasm_fill(i, bb[i]!, 1);
    memdump(mem, 0, 64);
    // console.log(exp.parseInteger(0));
    console.log(exp.parseHex(0));

    wasm_fill(0, 0, 64);

    for (let i = 0; i <= 1_000_000; i++) {
        // console.log(i);
        const buffer = Buffer.from(i.toString(16));
        // console.log(i.toString(16), buffer);
        for (let i = 0; i < buffer.length; i++) wasm_fill(i, buffer[i]!, 1);
        // memdump(mem, 0, 64);

        const parsed = exp.parseHex(0);
        if (Number(parsed) % 1000000 === 0) console.log(parsed);
        // console.log(BigInt(i), parsed);
        // for (const code of buffer) console.log(code, exp.moreThan57(BigInt(code)));
        if (parsed !== BigInt(i)) {
            memdump(mem, 0, 64);
            for (const code of buffer) console.log(code, exp.moreThan57(BigInt(code)));
            console.log('i parsed tostr', i, parsed, i.toString(16));
            break;
        }
    }

    // for (let i = 50; i < 65; i++) console.log(i, exp.isDigitCode(i));
})();
