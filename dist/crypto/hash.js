"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = sha256;
exports.doubleSha256 = doubleSha256;
exports.reverseBuffer = reverseBuffer;
const crypto_1 = require("crypto");
// single sha256
function sha256(data) {
    return (0, crypto_1.createHash)("sha256").update(data).digest();
}
// Perform Bitcoin-style double SHA256
function doubleSha256(data) {
    return sha256(sha256(data));
}
// Reverse buffer (Bitcoin uses little-endian internally)
function reverseBuffer(buf) {
    return Buffer.from(buf).reverse();
}
