"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitsToTarget = bitsToTarget;
exports.hashToBigInt = hashToBigInt;
function bitsToTarget(bits) {
    const exponent = bits >>> 24;
    const coefficient = bits & 0xffffff;
    const target = BigInt(coefficient) *
        (BigInt(2) ** (BigInt(8) * (BigInt(exponent) - BigInt(3))));
    return target;
}
function hashToBigInt(hash) {
    return BigInt("0x" + hash.toString("hex"));
}
