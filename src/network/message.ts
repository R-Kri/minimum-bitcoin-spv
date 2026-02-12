import { doubleSha256 } from "../crypto/hash";

const TESTNET_MAGIC = Buffer.from("0b110907", "hex");

function commandToBuffer(command: string): Buffer {
    const buffer = Buffer.alloc(12);
    buffer.write(command, "ascii");
    return buffer;
}

function getChecksum(payload: Buffer): Buffer {
    return doubleSha256(payload).slice(0, 4);
}

export function buildMessage(command: string, payload: Buffer): Buffer {
    const commandBuffer = commandToBuffer(command);

    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(payload.length, 0);

    const checksum = getChecksum(payload);

    return Buffer.concat([
        TESTNET_MAGIC,
        commandBuffer,
        lengthBuffer,
        checksum,
        payload
    ]);
}
