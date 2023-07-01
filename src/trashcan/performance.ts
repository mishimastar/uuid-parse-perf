import { Suite } from 'benchmark';
import { randomInt } from 'crypto';

const suite = new Suite();

// const sha = (s: Buffer) => createHash('sha256').update(s).digest().toString('base64');

// const lvlO = {
//     [0 /* Levels.trace */]: 'TRACE',
//     [1 /* Levels.debug */]: 'DEBUG',
//     [2 /* Levels.info */]: 'INFO',
//     [3 /* Levels.warn */]: 'WARN',
//     [4 /* Levels.error */]: 'ERROR'
// };
// const lvlN = Object.create(null);
// const lvlM = new Map(Object.entries(lvlO).map(([i, v]) => [Number(i), v]));
// const lvlM = new Map(Object.entries(lvlO));

// const L = 5;

// for (let i = 0; i < L; i++) {
//     const s = String(i) + 'a';
//     lvlO[String(i)] = s;
//     lvlN[String(i)] = s;
//     lvlM.set(String(i), s);
// }

// const resovle = (i) => {
//     switch (i) {
//         case '0':
//             return 'TRACE';
//         case '1':
//             return 'DEBUG';
//         case '2':
//             return 'INFO';
//         case '3':
//             return 'WARN';
//         case '4':
//             return 'ERROR';
//         default:
//             break;
//     }
// };

// for (let i = 0; i < 100000; i++) {
//     for (let i = 0; i < L; i++) {
//         lvlO[String(i)];
//     }
//     for (let i = 0; i < L; i++) {
//         lvlM.get(String(i));
//     }
//     for (let i = 0; i < L; i++) {
//         resovle(String(i));
//     }
// }

// const strings = [];

// for (let i = 0; i < 100; i++) {
//     strings.push(`${randomBytes(16).toString('base64')}::session::${randomBytes(16).toString('base64')}`);
//     strings.push(`${randomBytes(16).toString('base64')}::agent::${randomBytes(16).toString('base64')}`);
//     strings.push(randomBytes(48).toString('base64'));
//     strings.push(randomBytes(48).toString('base64'));
// }

// const entries = [];

// for (let i = 0; i < 1000; i++) {
//     entries.push([randomBytes(24).toString('base64'), randomBytes(1024).toString('base64')]);
// }

// const O = Object.fromEntries(entries);
// const ON = Object.create(null);
// for (const [k, v] of entries) {
//     ON[k] = v;
// }
// const M = new Map(entries);

// add tests
suite
    .add('M.random', () => {
        15 * 60 * 1000 + Math.floor(Math.random() * 6 * 60 * 1000 - 3 * 60 * 1000);
    })
    .add('random', () => {
        randomInt(12 * 60 * 1000, 18 * 60 * 1000);
    })
    .add('M.random 1', () => {
        900000 + Math.floor(Math.random() * 360000 - 180000);
    })

    // .add('Obj#access', () => {
    //     for (let i = 0; i < L; i++) {
    //         lvlO[String(i)];
    //     }
    // })
    // .add('Map#access', () => {
    //     for (let i = 0; i < L; i++) {
    //         lvlM.get(String(i));
    //     }
    // })
    // .add('Switch#access', () => {
    //     for (let i = 0; i < L; i++) {
    //         resovle(String(i));
    //     }
    // })
    // add listeners
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    // run async
    .run({ async: true });
