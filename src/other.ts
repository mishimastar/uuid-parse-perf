import { types } from 'cassandra-driver';
import type { UUIDParser } from './types';

const { TimeUuid } = types;
const unixToGregorian = 12219292800000;

export const CassandraParser: UUIDParser = (uuid: string): Date => TimeUuid.fromString(uuid).getDate();

export const UtilsParser: UUIDParser = (uuid: string): Date => {
    const uuidArr = uuid.split('-');
    const timeStr = [uuidArr[2]!.substring(1), uuidArr[1], uuidArr[0]].join('');
    return new Date(Math.trunc((parseInt(timeStr, 16) - 122192928000000000) / 10000));
};

export const SomeGithubParser: UUIDParser = (uuid: string): Date => {
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

export const MyTSParser: UUIDParser = (uuid: string): Date => {
    if (typeof uuid !== 'string' || uuid.length !== 36) throw new Error('Not a uuid');
    if (uuid[14] !== '1') throw new Error('Not a uuid v1');
    const tim = uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    const nanos = Number.parseInt(tim, 16);
    const millis = Math.floor(nanos / 10000);
    const millisUnix = millis - unixToGregorian;
    return new Date(millisUnix);
};

export const SermelyanParser: UUIDParser = (uuid: string): Date => {
    if (typeof uuid !== 'string' || uuid.length !== 36) throw new Error('Not a uuid');
    if (uuid[14] !== '1') throw new Error('Not a uuid v1');
    const tim = '0x' + uuid.slice(15, 18) + uuid.slice(9, 13) + uuid.slice(0, 8);
    return new Date(Math.floor(Number(tim) / 10000) - unixToGregorian);
};
