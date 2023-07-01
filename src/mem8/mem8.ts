import { readFileSync } from 'node:fs';
import type { UUIDParser } from '../types';

const path = './src/mem8/mem8.wasm';

// const order = [15, 16, 17, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7] as const;
// const shift = [56, 52, 48, 44, 40, 36, 32, 28, 24, 20, 16, 12, 8, 4, 0] as const;

type UUIDParserMem8 = {
    pasteChar: (offset: number, char: number) => void;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (char: BigInt) => BigInt;
    /** returns nanos */
    parseHex: () => BigInt;
};

export const GetMem8Parser = async (): Promise<UUIDParser> => {
    const { getMilliseconds, pasteChar } = (await WebAssembly.instantiate(readFileSync(path))).instance
        .exports as UUIDParserMem8;
    const Mem8Parser = (uuid: string): Date => {
        pasteChar(0, uuid.charCodeAt(0)!);
        pasteChar(1, uuid.charCodeAt(1)!);
        pasteChar(2, uuid.charCodeAt(2)!);
        pasteChar(3, uuid.charCodeAt(3)!);
        pasteChar(4, uuid.charCodeAt(4)!);
        pasteChar(5, uuid.charCodeAt(5)!);
        pasteChar(6, uuid.charCodeAt(6)!);
        pasteChar(7, uuid.charCodeAt(7)!);
        pasteChar(8, uuid.charCodeAt(8)!);
        pasteChar(9, uuid.charCodeAt(9)!);
        pasteChar(10, uuid.charCodeAt(10)!);
        pasteChar(11, uuid.charCodeAt(11)!);
        pasteChar(12, uuid.charCodeAt(12)!);
        pasteChar(13, uuid.charCodeAt(13)!);
        pasteChar(14, uuid.charCodeAt(14)!);
        pasteChar(15, uuid.charCodeAt(15)!);
        pasteChar(16, uuid.charCodeAt(16)!);
        pasteChar(17, uuid.charCodeAt(17)!);
        return new Date(Number(getMilliseconds()));
    };
    return Mem8Parser;
};
