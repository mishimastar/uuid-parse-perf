export const memdump = (mem: WebAssembly.Memory, start: number, len: number, asString = false, asNum = false) => {
    let view = new Uint8Array(mem.buffer);
    for (let i = 0; i < len; i++) {
        let index = start + i;
        process.stdout.write(`${view[index]!.toString(16).toUpperCase().padStart(2, '0')} `);
        if ((index + 1) % 16 === 0) {
            if (asString)
                for (let j = index - 15; j <= index; j++)
                    process.stdout.write(` ${view[j]! > 32 ? String.fromCharCode(view[j]!) || ' ' : '□'}`);
            if (asNum) for (let j = index - 15; j <= index; j++) process.stdout.write(` ${view[j]}`);

            console.log();
        }
    }
    console.log();
};
