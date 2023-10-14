// import { InitUUID } from './main';
// import { v1 } from 'uuid';

// const run = async () => {
//     const { v1: my, nanos } = await InitUUID();
//     console.log(my());
//     console.log(my());
//     console.log(my());
//     const set: string[] = [];
//     const st = performance.now();

//     for (let i = 0; i < 10000000; i++) set.push(my());
//     console.log((10000000 * 1000) / (performance.now() - st), 'ops/s');
//     console.log(set.length);
//     // const nn = new Set();
//     // for (const uu of set) nn.has(uu) ? console.log('found copy', uu) : nn.add(uu);
//     console.log(new Set(set).size);
//     const s = [];
//     const st2 = performance.now();
//     for (let i = 0; i < 10000000; i++) s.push(v1());
//     console.log((10000000 * 1000) / (performance.now() - st2), 'ops/s');
//     console.log(s.length);

//     const st3 = performance.now();
//     for (let i = 0; i < 10000000; i++) my();
//     console.log((10000000 * 1000) / (performance.now() - st3), 'ops/s');

//     const st4 = performance.now();
//     for (let i = 0; i < 10000000; i++) v1();
//     console.log((10000000 * 1000) / (performance.now() - st4), 'ops/s');

//     const nanoset = new Set();
//     for (let i = 0; i < 10000000; i++) nanoset.add(nanos());
//     console.log(nanoset.size);
//     // console.log(nanoset);
// };

// run().catch(console.error);
