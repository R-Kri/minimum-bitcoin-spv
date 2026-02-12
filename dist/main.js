"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./crypto/hash");
const header_1 = require("./block/header");
const difficulty_1 = require("./block/difficulty");
const chain_1 = require("./block/chain");
const headerHex = "01000000" +
    "0000000000000000000000000000000000000000000000000000000000000000" +
    "3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a" +
    "29ab5f49" +
    "ffff001d" +
    "1dac2b7c";
const headerBuffer = Buffer.from(headerHex, "hex");
const genesis = Buffer.from(headerHex, "hex");
const fakeSecond = Buffer.from(headerHex, "hex");
(0, chain_1.validateChain)([genesis, fakeSecond]);
const header = (0, header_1.parseBlockHeader)(headerBuffer);
console.log("Version:", header.version);
console.log("Timestamp:", header.timestamp);
console.log("Bits:", header.bits.toString(16));
console.log("Nonce:", header.nonce);
// hashing the header
const hash = (0, hash_1.doubleSha256)(headerBuffer);
// Display hash (human-readable)
const displayedHash = (0, hash_1.reverseBuffer)(hash).toString("hex");
console.log("Block Hash:", displayedHash);
// Decode difficulty target
const target = (0, difficulty_1.bitsToTarget)(header.bits);
// Convert hash to BigInt for comparison
const hashBigInt = BigInt("0x" + displayedHash);
console.log("Target (hex):", target.toString(16));
console.log("Hash (hex):", hashBigInt.toString(16));
// Validate Proof-of-Work
if (hashBigInt <= target) {
    console.log("Proof-of-Work VALID");
}
else {
    console.log("Proof-of-Work INVALID");
}
