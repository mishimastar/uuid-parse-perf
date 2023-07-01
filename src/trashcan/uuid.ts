import { types } from 'cassandra-driver';
import { readFileSync } from 'node:fs';
import { v1 } from 'uuid';
import type { ExportsMem } from './wasmuuid';

const { TimeUuid } = types;

const uuid = 'ece33fe4-1682-11ee-be56-0242ac120002';
const unixToGregorian = 12219292800000;

const cassandra = (uuid: string): Date => TimeUuid.fromString(uuid).getDate();

const utils = (uuid: string): Date => {
    const uuidArr = uuid.split('-');
    const timeStr = [uuidArr[2]!.substring(1), uuidArr[1], uuidArr[0]].join('');
    return new Date(Math.trunc((parseInt(timeStr, 16) - 122192928000000000) / 10000));
};

const github = (uuid: string): Date => {
    const buf = Buffer.from(uuid.replaceAll('-', ''), 'hex');
    var msec = 0;
    var i = 0;
    var b = buf || [];

    // inspect version at offset 6
    if ((b[i + 6]! & 0x10) != 0x10) throw new Error('uuid version 1 expected');

    // 'time_low'
    var tl = 0;
    tl |= (b[i++]! & 0xff) << 24;
    tl |= (b[i++]! & 0xff) << 16;
    tl |= (b[i++]! & 0xff) << 8;
    tl |= b[i++]! & 0xff;

    // `time_mid`
    var tmh = 0;
    tmh |= (b[i++]! & 0xff) << 8;
    tmh |= b[i++]! & 0xff;

    // `time_high_minus_version`
    tmh |= (b[i++]! & 0xf) << 24;
    tmh |= (b[i++]! & 0xff) << 16;

    // account for the sign bit
    msec = (1.0 * ((tl >>> 1) * 2 + ((tl & 0x7fffffff) % 2))) / 10000.0;
    msec += (1.0 * ((tmh >>> 1) * 2 + ((tmh & 0x7fffffff) % 2)) * 0x100000000) / 10000.0;

    // Per 4.1.4 - Convert from Gregorian epoch to unix epoch
    msec -= 12219292800000;

    return new Date(msec);
};

const myown = (uuid: string): Date => {
    if (typeof uuid !== 'string' || uuid.length !== 36) throw new Error('Not a uuid');
    if (uuid[14] !== '1') throw new Error('Not a uuid v1');
    const tim = uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    const nanos = Number.parseInt(tim, 16);
    const millis = Math.floor(nanos / 10000);
    const millisUnix = millis - unixToGregorian;
    return new Date(millisUnix);
};

const sergo = (uuid: string): Date => {
    if (typeof uuid !== 'string' || uuid.length !== 36) throw new Error('Not a uuid');
    if (uuid[14] !== '1') throw new Error('Not a uuid v1');
    const tim = '0x' + uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    return new Date(Math.floor(Number(tim) / 10000) - unixToGregorian);
};

type Uuid2Date = (uuid: string) => Date;

const perftest = (fun: (uuid: string) => Date, uuids: string[]): number => {
    const start = performance.now();
    for (const uuid of uuids) fun(uuid);
    return performance.now() - start;
};

// epochs: number, attempts: number,

const retrier = (uuids: string[][], ...funcs: Uuid2Date[]) => {
    const obj: Record<string, number[]> = Object.create(null);
    for (const { name } of funcs) obj[name] = [];
    for (const arr of uuids) for (const fun of funcs) obj[fun.name]!.push(perftest(fun, arr));
    // console.log(obj);
    const toSort: { name: string; rate: number }[] = [];
    for (const [name, arr] of Object.entries(obj))
        toSort.push({ name, rate: 1 / (arr.reduce((p, c) => p + c) / (epochs * attempts)) });
    toSort.sort((a, b) => {
        if (a.rate > b.rate) return -1;
        if (a.rate < b.rate) return 1;
        return 0;
    });

    let maxNameLen = 0;
    for (let i = 0; i < toSort.length; i++) {
        let { name } = toSort[i]!;
        name = `${i + 1}.` + name;
        if (name.length > maxNameLen) maxNameLen = name.length;
    }
    for (let i = 0; i < toSort.length; i++) {
        let { name, rate } = toSort[i]!;
        name = `${i + 1}.` + name;
        console.log(name + ' '.repeat(maxNameLen - name.length), rate.toFixed(0), 'ops/ms');
    }
};

const run = async () => {
    // Load the WASM file and instantiate it.
    const bytes = readFileSync('./src/asm/uuid.wasm');
    let obj = await WebAssembly.instantiate(new Uint8Array(bytes));
    const exp = obj.instance.exports as ExportsMem;
    return exp;
};
let expl: ExportsMem;

// const webasm = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
//     return new Date(Number(expl.millis()));
// };

// const webasm10 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
//     return new Date(Number(expl.millis10()));
// };
// const webasm11 = (uuid: string): Date => {
//     expl.fillmem(0, uuid.charCodeAt(0)!);
//     expl.fillmem(1, uuid.charCodeAt(1)!);
//     expl.fillmem(2, uuid.charCodeAt(2)!);
//     expl.fillmem(3, uuid.charCodeAt(3)!);
//     expl.fillmem(4, uuid.charCodeAt(4)!);
//     expl.fillmem(5, uuid.charCodeAt(5)!);
//     expl.fillmem(6, uuid.charCodeAt(6)!);
//     expl.fillmem(7, uuid.charCodeAt(7)!);
//     expl.fillmem(8, uuid.charCodeAt(8)!);
//     expl.fillmem(9, uuid.charCodeAt(9)!);
//     expl.fillmem(10, uuid.charCodeAt(10)!);
//     expl.fillmem(11, uuid.charCodeAt(11)!);
//     expl.fillmem(12, uuid.charCodeAt(12)!);
//     expl.fillmem(13, uuid.charCodeAt(13)!);
//     expl.fillmem(14, uuid.charCodeAt(14)!);
//     expl.fillmem(15, uuid.charCodeAt(15)!);
//     expl.fillmem(16, uuid.charCodeAt(16)!);
//     expl.fillmem(17, uuid.charCodeAt(17)!);
//     return new Date(Number(expl.millis10()));
// };

// const webasm20 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (let i = 0; i < 18; i++) expl.write32parsed64(i * 8, bb[i]!);
//     return new Date(Number(expl.millis20()));
// };
// const webasm21 = (uuid: string): Date => {
//     expl.write32parsed64(0, uuid.charCodeAt(0));
//     expl.write32parsed64(1 * 8, uuid.charCodeAt(1));
//     expl.write32parsed64(2 * 8, uuid.charCodeAt(2));
//     expl.write32parsed64(3 * 8, uuid.charCodeAt(3));
//     expl.write32parsed64(4 * 8, uuid.charCodeAt(4));
//     expl.write32parsed64(5 * 8, uuid.charCodeAt(5));
//     expl.write32parsed64(6 * 8, uuid.charCodeAt(6));
//     expl.write32parsed64(7 * 8, uuid.charCodeAt(7));
//     expl.write32parsed64(8 * 8, uuid.charCodeAt(8));
//     expl.write32parsed64(9 * 8, uuid.charCodeAt(9));
//     expl.write32parsed64(10 * 8, uuid.charCodeAt(10));
//     expl.write32parsed64(11 * 8, uuid.charCodeAt(11));
//     expl.write32parsed64(12 * 8, uuid.charCodeAt(12));
//     expl.write32parsed64(13 * 8, uuid.charCodeAt(13));
//     expl.write32parsed64(14 * 8, uuid.charCodeAt(14));
//     expl.write32parsed64(15 * 8, uuid.charCodeAt(15));
//     expl.write32parsed64(16 * 8, uuid.charCodeAt(16));
//     expl.write32parsed64(17 * 8, uuid.charCodeAt(17));
//     return new Date(Number(expl.millis20()));
// };
// const webasm20jsshift = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (let i = 0; i < 18; i++) expl.write32parsed64(i << 3, bb[i]!);
//     return new Date(Number(expl.millis20()));
// };

//
// const webasm30 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (const index of order) expl.write32parsed64toglobal(bb[index]!);
//     return new Date(Number(expl.millis30()));
// };
// const webasm31 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     for (let i = 0; i < order.length; i++) expl.write32parsed64toglobalShift(shift[i]!, bb[order[i]!]!);
//     return new Date(Number(expl.millis30()));
// };
// const webasm32 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     expl.write32parsed64toglobal(bb[15]!);
//     expl.write32parsed64toglobal(bb[16]!);
//     expl.write32parsed64toglobal(bb[17]!);
//     expl.write32parsed64toglobal(bb[9]!);
//     expl.write32parsed64toglobal(bb[10]!);
//     expl.write32parsed64toglobal(bb[11]!);
//     expl.write32parsed64toglobal(bb[12]!);
//     expl.write32parsed64toglobal(bb[0]!);
//     expl.write32parsed64toglobal(bb[1]!);
//     expl.write32parsed64toglobal(bb[2]!);
//     expl.write32parsed64toglobal(bb[3]!);
//     expl.write32parsed64toglobal(bb[4]!);
//     expl.write32parsed64toglobal(bb[5]!);
//     expl.write32parsed64toglobal(bb[6]!);
//     expl.write32parsed64toglobal(bb[7]!);
//     return new Date(Number(expl.millis30()));
// };
// const webasm33 = (uuid: string): Date => {
//     const { write32parsed64toglobal, millis30 } = expl;
//     write32parsed64toglobal(uuid.charCodeAt(15)!);
//     write32parsed64toglobal(uuid.charCodeAt(16)!);
//     write32parsed64toglobal(uuid.charCodeAt(17)!);
//     write32parsed64toglobal(uuid.charCodeAt(9)!);
//     write32parsed64toglobal(uuid.charCodeAt(10)!);
//     write32parsed64toglobal(uuid.charCodeAt(11)!);
//     write32parsed64toglobal(uuid.charCodeAt(12)!);
//     write32parsed64toglobal(uuid.charCodeAt(0)!);
//     write32parsed64toglobal(uuid.charCodeAt(1)!);
//     write32parsed64toglobal(uuid.charCodeAt(2)!);
//     write32parsed64toglobal(uuid.charCodeAt(3)!);
//     write32parsed64toglobal(uuid.charCodeAt(4)!);
//     write32parsed64toglobal(uuid.charCodeAt(5)!);
//     write32parsed64toglobal(uuid.charCodeAt(6)!);
//     write32parsed64toglobal(uuid.charCodeAt(7)!);
//     return new Date(Number(millis30()));
// };
// const webasm34 = (uuid: string): Date => {
//     for (const index of order) expl.write32parsed64toglobal(uuid.charCodeAt(index)!);
//     return new Date(Number(expl.millis30()));
// };
// const webasm35 = (uuid: string): Date => {
//     const bb = Buffer.from(uuid);
//     expl.write32parsed64toglobalShift(56, bb[15]!);
//     expl.write32parsed64toglobalShift(52, bb[16]!);
//     expl.write32parsed64toglobalShift(48, bb[17]!);
//     expl.write32parsed64toglobalShift(44, bb[9]!);
//     expl.write32parsed64toglobalShift(40, bb[10]!);
//     expl.write32parsed64toglobalShift(36, bb[11]!);
//     expl.write32parsed64toglobalShift(32, bb[12]!);
//     expl.write32parsed64toglobalShift(28, bb[0]!);
//     expl.write32parsed64toglobalShift(24, bb[1]!);
//     expl.write32parsed64toglobalShift(20, bb[2]!);
//     expl.write32parsed64toglobalShift(16, bb[3]!);
//     expl.write32parsed64toglobalShift(12, bb[4]!);
//     expl.write32parsed64toglobalShift(8, bb[5]!);
//     expl.write32parsed64toglobalShift(4, bb[6]!);
//     expl.write32parsed64toglobalShift(0, bb[7]!);
//     return new Date(Number(expl.millis30()));
// };
// const webasm36 = (uuid: string): Date => {
//     expl.write32parsed64toglobalShift(28, uuid.charCodeAt(0)!);
//     expl.write32parsed64toglobalShift(24, uuid.charCodeAt(1)!);
//     expl.write32parsed64toglobalShift(20, uuid.charCodeAt(2)!);
//     expl.write32parsed64toglobalShift(16, uuid.charCodeAt(3)!);
//     expl.write32parsed64toglobalShift(12, uuid.charCodeAt(4)!);
//     expl.write32parsed64toglobalShift(8, uuid.charCodeAt(5)!);
//     expl.write32parsed64toglobalShift(4, uuid.charCodeAt(6)!);
//     expl.write32parsed64toglobalShift(0, uuid.charCodeAt(7)!);
//     expl.write32parsed64toglobalShift(44, uuid.charCodeAt(9)!);
//     expl.write32parsed64toglobalShift(40, uuid.charCodeAt(10)!);
//     expl.write32parsed64toglobalShift(36, uuid.charCodeAt(11)!);
//     expl.write32parsed64toglobalShift(32, uuid.charCodeAt(12)!);
//     expl.write32parsed64toglobalShift(56, uuid.charCodeAt(15)!);
//     expl.write32parsed64toglobalShift(52, uuid.charCodeAt(16)!);
//     expl.write32parsed64toglobalShift(48, uuid.charCodeAt(17)!);
//     return new Date(Number(expl.millis30()));
// };

const webasm40 = (uuid: string): Date => {
    return new Date(Number(expl.handle32arr(...Buffer.from(uuid).slice(0, 18))));
};

const webasm10constUUID = (_uuid: string): Date => {
    return new Date(Number(expl.millis10()));
};

const webasmtextenc = (uuid: string): Date => {
    const strBuf = new TextEncoder().encode(uuid);
    const outBuf = new Uint8Array(expl.memory.buffer, 0, strBuf.length);
    for (let i = 0; i < 18; i++) outBuf[i] = strBuf[i]!;

    return new Date(Number(expl.millis()));
};

const webasmnocopy = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
    return new Date(Number(expl.millis2()));
};

const webasmnocopybutstack = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
    return new Date(Number(expl.millis3()));
};

const webasmReturn0 = (_uuid: string): Date => {
    return new Date(Number(expl.parseHexM()));
};

const epochs = 100;
const attempts = 10000;

const log = (uuid: string, fn: (uuid: string) => Date) => console.log(fn.name, fn(uuid));

run().then((exp) => {
    expl = exp;
    log(uuid, github);
    log(uuid, myown);
    log(uuid, cassandra);
    log(uuid, utils);
    log(uuid, sergo);
    log(uuid, webasm10constUUID);
    // log(uuid, webasm);
    log(uuid, webasmnocopy);
    log(uuid, webasmnocopybutstack);
    // log(uuid, webasm10);
    // log(uuid, webasm11);
    // log(uuid, webasm20);
    // log(uuid, webasm21);
    // log(uuid, webasm20jsshift);
    // log(uuid, webasm30);
    // log(uuid, webasm31);
    // log(uuid, webasm32);
    // log(uuid, webasm33);
    // log(uuid, webasm34);
    // log(uuid, webasm35);
    // log(uuid, webasm36);
    log(uuid, webasm40);
    log(uuid, webasmtextenc);
    log(uuid, webasmReturn0);
    const uuids: string[][] = [];
    for (let i = 0; i < epochs; i++) {
        const buf: string[] = [];
        for (let j = 0; j < attempts; j++) buf[j] = v1();
        uuids.push(buf);
    }

    console.log('uuids generated', epochs * attempts, 'pcs');

    retrier(
        uuids,
        // webasm,
        // webasm10,
        // webasm11,
        // webasm20,
        // webasm20jsshift,
        // webasm21,
        // webasm30,
        // webasm31,
        // webasm32,
        // webasm33,
        // webasm34,
        // webasm35,
        // webasm36,
        webasm40,
        webasm10constUUID,
        webasmnocopy,
        webasmnocopybutstack,
        webasmtextenc,
        webasmReturn0,
        myown,
        github,
        cassandra,
        utils,
        sergo
    );
});
