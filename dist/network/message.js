"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessage = buildMessage;
const hash_1 = require("../crypto/hash");
const TESTNET_MAGIC = Buffer.from("0b110907", "hex");
function commandToBuffer(command) {
    const buffer = Buffer.alloc(12);
    buffer.write(command, "ascii");
    return buffer;
}
function getChecksum(payload) {
    return (0, hash_1.doubleSha256)(payload).slice(0, 4);
}
function buildMessage(command, payload) {
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
