export interface BlockHeader {
    version: number;
    previousBlockHash: Buffer;
    merkleRoot: Buffer;
    timestamp: number;
    bits: number;
    nonce: number;
}

export function parseBlockHeader(buffer: Buffer): BlockHeader {
    if (buffer.length !== 80) {
        throw new Error("Block header must be 80 bytes");
    }

    return {
        version: buffer.readUInt32LE(0),
        previousBlockHash: buffer.slice(4, 36),
        merkleRoot: buffer.slice(36, 68),
        timestamp: buffer.readUInt32LE(68),
        bits: buffer.readUInt32LE(72),
        nonce: buffer.readUInt32LE(76),
    };
}
