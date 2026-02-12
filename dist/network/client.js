"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startClient = startClient;
const net_1 = __importDefault(require("net"));
const message_1 = require("./message");
const HOST = "testnet-seed.bitcoin.jonasschnelli.ch";
const PORT = 18333;
function startClient() {
    const socket = net_1.default.createConnection(PORT, HOST, () => {
        console.log("Connected to testnet node");
        const versionPayload = buildVersionPayload();
        const versionMessage = (0, message_1.buildMessage)("version", versionPayload);
        socket.write(versionMessage);
        console.log("Sent version message");
    });
    socket.on("data", (data) => {
        console.log("Received:", data.toString("hex"));
    });
    socket.on("error", (err) => {
        console.error("Error:", err);
    });
    socket.on("close", () => {
        console.log("Connection closed");
    });
}
function buildVersionPayload() {
    const buffers = [];
    // protocol version
    const version = Buffer.alloc(4);
    version.writeInt32LE(70015, 0);
    buffers.push(version);
    // services (8 bytes)
    buffers.push(Buffer.alloc(8));
    // timestamp (8 bytes)
    const timestamp = Buffer.alloc(8);
    timestamp.writeBigInt64LE(BigInt(Math.floor(Date.now() / 1000)), 0);
    buffers.push(timestamp);
    // addr_recv (26 bytes)
    buffers.push(Buffer.alloc(26));
    // addr_from (26 bytes)
    buffers.push(Buffer.alloc(26));
    // nonce (8 bytes)
    const nonce = Buffer.alloc(8);
    nonce.writeBigUInt64LE(BigInt(Math.floor(Math.random() * 100000)), 0);
    buffers.push(nonce);
    // user agent (varstr)
    const userAgent = Buffer.from("/minimal-spv:0.1.0/");
    buffers.push(Buffer.from([userAgent.length]));
    buffers.push(userAgent);
    // start height
    const startHeight = Buffer.alloc(4);
    startHeight.writeInt32LE(0, 0);
    buffers.push(startHeight);
    // relay flag
    buffers.push(Buffer.from([0]));
    return Buffer.concat(buffers);
}
