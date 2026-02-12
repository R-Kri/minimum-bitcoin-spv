"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHeader = validateHeader;
exports.validateChain = validateChain;
const hash_1 = require("../crypto/hash");
const header_1 = require("./header");
const difficulty_1 = require("./difficulty");
function validateHeader(buffer) {
    const header = (0, header_1.parseBlockHeader)(buffer);
    const hash = (0, hash_1.doubleSha256)(buffer);
    const hashHex = (0, hash_1.reverseBuffer)(hash).toString("hex");
    const target = (0, difficulty_1.bitsToTarget)(header.bits);
    const hashBigInt = BigInt("0x" + hashHex);
    if (hashBigInt > target) {
        throw new Error("Invalid Proof-of-Work");
    }
    return { header, hashHex };
}
function validateChain(headerBuffers) {
    let previousHash = null;
    for (let i = 0; i < headerBuffers.length; i++) {
        const { header, hashHex } = validateHeader(headerBuffers[i]);
        console.log(`Block ${i} hash: ${hashHex}`);
        if (previousHash) {
            const prevField = (0, hash_1.reverseBuffer)(header.previousBlockHash).toString("hex");
            if (prevField !== previousHash) {
                throw new Error(`Invalid chain linkage at block ${i}`);
            }
        }
        previousHash = hashHex;
    }
    console.log("Chain VALID ");
}
