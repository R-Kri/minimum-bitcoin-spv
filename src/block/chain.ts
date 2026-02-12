import { doubleSha256, reverseBuffer } from "../crypto/hash";
import { parseBlockHeader, BlockHeader } from "./header";
import { bitsToTarget } from "./difficulty";

export function validateHeader(buffer: Buffer): { header: BlockHeader; hashHex: string } {
    const header = parseBlockHeader(buffer);

    const hash = doubleSha256(buffer);
    const hashHex = reverseBuffer(hash).toString("hex");

    const target = bitsToTarget(header.bits);
    const hashBigInt = BigInt("0x" + hashHex);

    if (hashBigInt > target) {
        throw new Error("Invalid Proof-of-Work");
    }

    return { header, hashHex };
}

export function validateChain(headerBuffers: Buffer[]): void {
    let previousHash: string | null = null;

    for (let i = 0; i < headerBuffers.length; i++) {
        const { header, hashHex } = validateHeader(headerBuffers[i]);

        console.log(`Block ${i} hash: ${hashHex}`);

        if (previousHash) {
            const prevField = reverseBuffer(header.previousBlockHash).toString("hex");

            if (prevField !== previousHash) {
                throw new Error(`Invalid chain linkage at block ${i}`);
            }
        }

        previousHash = hashHex;
    }

    console.log("Chain VALID ");
}