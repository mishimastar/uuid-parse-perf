import { readFileSync } from 'node:fs';
import type { UUIDParser } from '../types';

const path = './src/global/global.wasm';

// const order = [15, 16, 17, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7] as const;
// const shift = [56, 52, 48, 44, 40, 36, 32, 28, 24, 20, 16, 12, 8, 4, 0] as const;

type UUIDParserGlobal = {
    pasteChar: (char: number) => void;
    pasteShiftChar: (shift: number, char: number) => void;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (char: BigInt) => BigInt;
};

export const GetGlobalParser1 = async (): Promise<UUIDParser> => {
    const { getMilliseconds, pasteChar } = (await WebAssembly.instantiate(readFileSync(path))).instance
        .exports as UUIDParserGlobal;
    const GlobalParser = (uuid: string): Date => {
        pasteChar(uuid.charCodeAt(15)!);
        pasteChar(uuid.charCodeAt(16)!);
        pasteChar(uuid.charCodeAt(17)!);
        pasteChar(uuid.charCodeAt(9)!);
        pasteChar(uuid.charCodeAt(10)!);
        pasteChar(uuid.charCodeAt(11)!);
        pasteChar(uuid.charCodeAt(12)!);
        pasteChar(uuid.charCodeAt(0)!);
        pasteChar(uuid.charCodeAt(1)!);
        pasteChar(uuid.charCodeAt(2)!);
        pasteChar(uuid.charCodeAt(3)!);
        pasteChar(uuid.charCodeAt(4)!);
        pasteChar(uuid.charCodeAt(5)!);
        pasteChar(uuid.charCodeAt(6)!);
        pasteChar(uuid.charCodeAt(7)!);
        return new Date(Number(getMilliseconds()));
    };
    return GlobalParser;
};

export const GetGlobalParser2 = async (): Promise<UUIDParser> => {
    const { getMilliseconds, pasteShiftChar } = (await WebAssembly.instantiate(readFileSync(path))).instance
        .exports as UUIDParserGlobal;

    const GlobalParserShifts = (uuid: string): Date => {
        pasteShiftChar(28, uuid.charCodeAt(0)!);
        pasteShiftChar(24, uuid.charCodeAt(1)!);
        pasteShiftChar(20, uuid.charCodeAt(2)!);
        pasteShiftChar(16, uuid.charCodeAt(3)!);
        pasteShiftChar(12, uuid.charCodeAt(4)!);
        pasteShiftChar(8, uuid.charCodeAt(5)!);
        pasteShiftChar(4, uuid.charCodeAt(6)!);
        pasteShiftChar(0, uuid.charCodeAt(7)!);
        pasteShiftChar(44, uuid.charCodeAt(9)!);
        pasteShiftChar(40, uuid.charCodeAt(10)!);
        pasteShiftChar(36, uuid.charCodeAt(11)!);
        pasteShiftChar(32, uuid.charCodeAt(12)!);
        pasteShiftChar(56, uuid.charCodeAt(15)!);
        pasteShiftChar(52, uuid.charCodeAt(16)!);
        pasteShiftChar(48, uuid.charCodeAt(17)!);
        return new Date(Number(getMilliseconds()));
    };
    return GlobalParserShifts;
};
