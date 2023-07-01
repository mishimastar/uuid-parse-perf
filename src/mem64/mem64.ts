import { readFileSync } from 'node:fs';
import type { UUIDParser } from '../types';

const path = './src/mem64/mem64.wasm';

// const order = [15, 16, 17, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7] as const;
// const shift = [56, 52, 48, 44, 40, 36, 32, 28, 24, 20, 16, 12, 8, 4, 0] as const;

type UUIDParserMem64 = {
    pasteChar: (offset: number, char: number) => void;
    read64: (offset: number) => BigInt;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (char: BigInt) => BigInt;
    /** returns nanos */
    calcHex: () => BigInt;
};

export const GetMem64Parser = async (): Promise<UUIDParser> => {
    const { getMilliseconds, pasteChar } = (await WebAssembly.instantiate(readFileSync(path))).instance
        .exports as UUIDParserMem64;

    const Mem64Parser = (uuid: string): Date => {
        pasteChar(0, uuid.charCodeAt(0));
        pasteChar(8, uuid.charCodeAt(1));
        pasteChar(16, uuid.charCodeAt(2));
        pasteChar(24, uuid.charCodeAt(3));
        pasteChar(32, uuid.charCodeAt(4));
        pasteChar(40, uuid.charCodeAt(5));
        pasteChar(48, uuid.charCodeAt(6));
        pasteChar(56, uuid.charCodeAt(7));
        pasteChar(64, uuid.charCodeAt(8));
        pasteChar(72, uuid.charCodeAt(9));
        pasteChar(80, uuid.charCodeAt(10));
        pasteChar(88, uuid.charCodeAt(11));
        pasteChar(96, uuid.charCodeAt(12));
        pasteChar(104, uuid.charCodeAt(13));
        pasteChar(112, uuid.charCodeAt(14));
        pasteChar(120, uuid.charCodeAt(15));
        pasteChar(128, uuid.charCodeAt(16));
        pasteChar(136, uuid.charCodeAt(17));
        return new Date(Number(getMilliseconds()));
    };
    return Mem64Parser;
};
