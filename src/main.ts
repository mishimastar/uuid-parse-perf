import { GetGlobalParser1, GetGlobalParser2 } from './global/global';
import { GetMem64Parser } from './mem64/mem64';
import { GetMem8Parser } from './mem8/mem8';
import { RetrierGen, RetrierParse } from './performance.js';
import {
    CassandraParser,
    MyTSParser,
    SermelyanParser,
    SomeGithubParser,
    UtilsParser,
    CassandraGenerator
} from './other.js';
import { v1 } from 'uuid';

import { InitUUID } from 'uuid-wasm';

const run = async () => {
    const mem8 = await GetMem8Parser();
    const mem64 = await GetMem64Parser();
    const global1 = await GetGlobalParser1();
    const global2 = await GetGlobalParser2();
    const { unsafeTimeFromV1, timeFromV1, v1: myv1 } = await InitUUID();
    // const timeFrom = (uuid: string) => timeFromV1(uuid);
    // const unsafeTimeFrom = (uuid: string) => unsafeTimeFromV1(uuid);
    // console.log(v1(), nanos());
    RetrierParse(
        100000,
        10,
        mem8,
        mem64,
        timeFromV1,
        unsafeTimeFromV1,
        global1,
        global2,
        CassandraParser,
        MyTSParser,
        SermelyanParser,
        SomeGithubParser,
        UtilsParser
    );

    RetrierGen(100000, 10, v1, CassandraGenerator, myv1);
};

run().catch(console.error);
