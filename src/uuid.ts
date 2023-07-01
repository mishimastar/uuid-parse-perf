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

// const desat = 10000n;

const myown = (uuid: string): Date => {
    if (typeof uuid !== 'string' || uuid.length !== 36) throw new Error('Not a uuid');
    if (uuid[14] !== '1') throw new Error('Not a uuid v1');
    const tim = uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    const nanos = Number.parseInt(tim, 16);
    // const tim = '0x' + uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    // const nanos = BigInt(tim);
    // const millis = Number(nanos / desat);
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
    const stop = performance.now();
    const d = stop - start;
    // const avg = d / attempts;
    return d;
    // console.log(fun.name, avg, 'ms/attempt', 1 / avg, 'aps');
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

const webasm = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
    return new Date(Number(expl.millis()));
};

const webasm10 = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
    return new Date(Number(expl.millis10()));
};

const webasm20 = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.write32parsed64(i * 8, bb[i]!);
    return new Date(Number(expl.millis20()));
};

const webasm20jsshift = (uuid: string): Date => {
    const bb = Buffer.from(uuid);
    for (let i = 0; i < 18; i++) expl.write32parsed64(i << 3, bb[i]!);
    return new Date(Number(expl.millis20()));
};

const webasm10noJSMEM = (_uuid: string): Date => {
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

const webasmNOLOGIC = (_uuid: string): Date => {
    // const bb = Buffer.from(uuid);
    // for (let i = 0; i < 18; i++) expl.fillmem(i, bb[i]!);
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
    log(uuid, webasm10noJSMEM);
    log(uuid, webasm);
    log(uuid, webasmnocopy);
    log(uuid, webasmnocopybutstack);
    log(uuid, webasm10);
    log(uuid, webasm20);
    log(uuid, webasm20jsshift);
    log(uuid, webasmtextenc);
    log(uuid, webasmNOLOGIC);
    const uuids: string[][] = [];
    for (let i = 0; i < epochs; i++) {
        const buf: string[] = [];
        for (let j = 0; j < attempts; j++) buf[j] = v1();
        uuids.push(buf);
    }

    console.log('uuids generated', epochs * attempts, 'pcs');

    retrier(
        uuids,
        webasm,
        webasm10,
        webasm20,
        webasm20jsshift,
        webasm10noJSMEM,
        webasmnocopy,
        webasmnocopybutstack,
        webasmtextenc,
        webasmNOLOGIC,
        myown,
        github,
        cassandra,
        utils,
        sergo
    );
});
