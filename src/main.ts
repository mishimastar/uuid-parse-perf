import { GetGlobalParser1, GetGlobalParser2 } from './global/global';
import { GetMem64Parser } from './mem64/mem64';
import { GetMem8Parser } from './mem8/mem8';
import { Retrier } from './performance';
import { CassandraParser, MyTSParser, SermelyanParser, SomeGithubParser, UtilsParser } from './other';

const run = async () => {
    const mem8 = await GetMem8Parser();
    const mem64 = await GetMem64Parser();
    const global1 = await GetGlobalParser1();
    const global2 = await GetGlobalParser2();

    Retrier(
        100,
        10000,
        mem8,
        mem64,
        global1,
        global2,
        CassandraParser,
        MyTSParser,
        SermelyanParser,
        SomeGithubParser,
        UtilsParser
    );
};

run().catch(console.error);
