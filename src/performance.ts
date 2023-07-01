import type { UUIDParser } from './types';
import { v1 } from 'uuid';

type median = { median: number; min: number; max: number };
type avg = { avg: number; min: number; max: number };
type statsObj = { median: median; avg: avg };

const evalParser = (fun: UUIDParser, uuids: string[]): number => {
    const start = performance.now();
    for (const uuid of uuids) fun(uuid);
    return performance.now() - start;
};

const createMap = (funcs: UUIDParser[]): Map<string, number[]> => {
    const out = new Map<string, number[]>();
    for (const { name } of funcs) out.set(name, []);
    // console.log('map', funcs, out);
    return out;
};

const generateUUIDs = (epochs: number, attempts: number): string[][] => {
    console.log('Generating', epochs * attempts, 'UUIDs v1....');
    const out: string[][] = [];
    for (let i = 0; i < epochs; i++) {
        const buf: string[] = [];
        for (let j = 0; j < attempts; j++) buf.push(v1());
        out.push(buf);
    }
    console.log('Generated', epochs * attempts, 'UUIDs v1');
    return out;
};

const calcAvgOpsPs = (arr: number[], epochs: number, attempts: number): avg => {
    const avgs: number[] = arr.map((total) => (attempts * 1000) / total);
    const avg = avgs.reduce((p, c) => p + c) / epochs;
    let max = 0;
    avgs.forEach((a) => (a > max ? (max = a) : undefined));
    let min = max;
    avgs.forEach((a) => (a < min ? (min = a) : undefined));
    return { avg, min: avg / (avg - min), max: avg / (max - avg) };
};

const calcMedianOpsPs = (arr: number[], _epochs: number, attempts: number): median => {
    const avgs: number[] = arr.map((total) => (attempts * 1000) / total);
    avgs.sort();

    const median =
        avgs.length % 2 === 1
            ? avgs[Math.trunc(avgs.length / 2)]!
            : (avgs[avgs.length / 2]! + avgs[avgs.length / 2 - 1]!) / 2;
    let max = 0;
    avgs.forEach((a) => (a > max ? (max = a) : undefined));
    let min = max;
    avgs.forEach((a) => (a < min ? (min = a) : undefined));
    return { median, min: median / (median - min), max: median / (max - median) };
};

const calcStats = (map: Map<string, number[]>, epochs: number, attempts: number) => {
    const stats = new Map<string, statsObj>();
    for (const [name, arr] of map)
        stats.set(name, { avg: calcAvgOpsPs(arr, epochs, attempts), median: calcMedianOpsPs(arr, epochs, attempts) });

    return stats;
};

const drawStats = (stats: Map<string, statsObj>) => {
    const toSort: { name: string; rate: number }[] = [];
    for (const [name, s] of stats) toSort.push({ name, rate: s.avg.avg });
    toSort.sort((a, b) => {
        if (a.rate > b.rate) return -1;
        if (a.rate < b.rate) return 1;
        return 0;
    });

    let maxNameLen = 0;
    for (let i = 0; i < toSort.length; i++) {
        let { name } = toSort[i]!;
        name = `${i + 1}. ` + name;
        if (name.length > maxNameLen) maxNameLen = name.length;
    }
    for (let i = 0; i < toSort.length; i++) drawString(i, maxNameLen, toSort[i]!.name, stats.get(toSort[i]!.name)!);
};

const fn = (num: number): string => {
    const parsed = num.toFixed(0).split('.');
    return parsed[0]!.replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (parsed[1] ? '.' + parsed[1] : '');
};

const drawString = (pos: number, maxNameLen: number, name: string, s: statsObj) => {
    let { avg, median } = s;
    name = `${pos + 1}. ` + name;
    console.log(
        name + ' '.repeat(maxNameLen - name.length + 1),
        'avg',
        fn(avg.avg),
        'ops/s ±',
        ((avg.max + avg.min) / 2).toFixed(2),
        '%, med',
        fn(median.median),
        'ops/s ±',
        ((median.max + median.min) / 2).toFixed(2),
        '%'
    );
};

export const Retrier = (epochs: number, attempts: number, ...funcs: UUIDParser[]) => {
    const map = createMap(funcs);
    const uuids = generateUUIDs(epochs, attempts);
    for (const arr of uuids) for (const fun of funcs) map.get(fun.name)!.push(evalParser(fun, arr));
    const stats = calcStats(map, epochs, attempts);
    drawStats(stats);
};
