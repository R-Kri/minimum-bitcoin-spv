"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./crypto/hash");
const header_1 = require("./block/header");
const headerHex = "01000000" +
    "0000000000000000000000000000000000000000000000000000000000000000" +
    "3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a" +
    "29ab5f49" +
    "ffff001d" +
    "1dac2b7c";
const headerBuffer = Buffer.from(headerHex, "hex");
const header = (0, header_1.parseBlockHeader)(headerBuffer);
console.log("Version:", header.version);
console.log("Timestamp:", header.timestamp);
console.log("Bits:", header.bits.toString(16));
console.log("Nonce:", header.nonce);
const hash = (0, hash_1.doubleSha256)(headerBuffer);
const displayedHash = (0, hash_1.reverseBuffer)(hash).toString("hex");
console.log("Block Hash:", displayedHash);
