import { doubleSha256, reverseBuffer } from "./crypto/hash";
import { parseBlockHeader } from "./block/header";
import { bitsToTarget, hashToBigInt } from "./block/difficulty";

const headerHex =
"01000000" +
"0000000000000000000000000000000000000000000000000000000000000000" +
"3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a" +
"29ab5f49" +
"ffff001d" +
"1dac2b7c";

const headerBuffer = Buffer.from(headerHex, "hex");

const header = parseBlockHeader(headerBuffer);

console.log("Version:", header.version);
console.log("Timestamp:", header.timestamp);
console.log("Bits:", header.bits.toString(16));
console.log("Nonce:", header.nonce);

// hashing the header
const hash = doubleSha256(headerBuffer);

// Display hash (human-readable)
const displayedHash = reverseBuffer(hash).toString("hex");
console.log("Block Hash:", displayedHash);

// Decode difficulty target
const target = bitsToTarget(header.bits);

// Convert hash to BigInt for comparison
const hashBigInt = BigInt("0x" + displayedHash);

console.log("Target (hex):", target.toString(16));
console.log("Hash (hex):", hashBigInt.toString(16));

// Validate Proof-of-Work
if (hashBigInt <= target) {
    console.log("Proof-of-Work VALID ✅");
} else {
    console.log("Proof-of-Work INVALID ❌");
}
