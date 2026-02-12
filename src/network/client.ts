// client.ts

import net from "net";
import { buildMessage } from "./message";
import { validateHeader } from "../block/chain";

const HOST = "testnet-seed.bitcoin.jonasschnelli.ch";
const PORT = 18333;

const TESTNET_MAGIC = Buffer.from("0b110907", "hex");

export function startClient() {
    let messageBuffer = Buffer.alloc(0);

    const socket = net.createConnection(PORT, HOST, () => {
        console.log("Connected to testnet node");

        const versionMessage = buildMessage("version", buildVersionPayload());
        socket.write(versionMessage);
        console.log("Sent version message");
    });

    socket.on("data", (data: Buffer) => {
        messageBuffer = Buffer.concat([messageBuffer, data]);

        while (messageBuffer.length >= 24) {
            // realign if magic bytes don't match
            if (!messageBuffer.slice(0, 4).equals(TESTNET_MAGIC)) {
                console.log("Magic mismatch, shifting buffer...");
                messageBuffer = messageBuffer.slice(1);
                continue;
            }

            const length = messageBuffer.readUInt32LE(16);
            const fullMessageLength = 24 + length;

            // wait until the full message has arrived
            if (messageBuffer.length < fullMessageLength) {
                return;
            }

            const message = messageBuffer.slice(0, fullMessageLength);
            messageBuffer = messageBuffer.slice(fullMessageLength);

            handleMessage(message, socket);
        }
    });

    socket.on("error", (err) => {
        console.error("Error:", err);
    });

    socket.on("close", () => {
        console.log("Connection closed");
    });
}

function handleMessage(data: Buffer, socket: net.Socket) {
    const commandBuffer = data.slice(4, 16);
    const length = data.readUInt32LE(16);
    const payload = data.slice(24, 24 + length);

    const command = commandBuffer.toString("ascii").replace(/\0+$/, "");
    console.log("Received command:", command);

    if (command === "version") {
        console.log("Received version, sending verack");
        socket.write(buildMessage("verack", Buffer.alloc(0)));
    }

    if (command === "verack") {
        console.log("Handshake complete ✅");
        socket.write(buildMessage("getheaders", buildGetHeadersPayload()));
        console.log("Sent getheaders");
    }

    if (command === "headers") {
        parseHeadersPayload(payload);
    }
}

function buildVersionPayload(): Buffer {
    const buffers: Buffer[] = [];

    const version = Buffer.alloc(4);
    version.writeInt32LE(70015, 0);
    buffers.push(version);

    buffers.push(Buffer.alloc(8)); // services

    const timestamp = Buffer.alloc(8);
    timestamp.writeBigInt64LE(BigInt(Math.floor(Date.now() / 1000)), 0);
    buffers.push(timestamp);

    buffers.push(Buffer.alloc(26)); // addr_recv
    buffers.push(Buffer.alloc(26)); // addr_from

    const nonce = Buffer.alloc(8);
    nonce.writeBigUInt64LE(BigInt(Math.floor(Math.random() * 100000)), 0);
    buffers.push(nonce);

    const userAgent = Buffer.from("/minimal-spv:0.1.0/");
    buffers.push(Buffer.from([userAgent.length]));
    buffers.push(userAgent);

    const startHeight = Buffer.alloc(4);
    startHeight.writeInt32LE(0, 0);
    buffers.push(startHeight);

    buffers.push(Buffer.from([0])); // relay flag

    return Buffer.concat(buffers);
}

function buildGetHeadersPayload(): Buffer {
    const buffers: Buffer[] = [];

    const version = Buffer.alloc(4);
    version.writeInt32LE(70015, 0);
    buffers.push(version);

    buffers.push(Buffer.from([1])); // one block locator hash

    // testnet genesis hash, little-endian
    const genesisHash = Buffer.from(
        "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
        "hex"
    );
    buffers.push(Buffer.from(genesisHash).reverse());

    buffers.push(Buffer.alloc(32)); // stop hash (zero = get max headers)

    return Buffer.concat(buffers);
}

function parseHeadersPayload(payload: Buffer) {
    let offset = 0;

    const varint = readVarInt(payload, offset);
    const count = varint.value;
    offset += varint.size;


    console.log("Header count:", count);

    let previousHash: string | null = null;

    for (let i = 0; i < count; i++) {
        const headerBuffer = payload.slice(offset, offset + 80);
        offset += 80;
        offset += 1; // tx count (always 0 in headers message)

        const { header, hashHex } = validateHeader(headerBuffer);

        if (previousHash) {
            const prevField = Buffer.from(header.previousBlockHash)
                .reverse()
                .toString("hex");

            if (prevField !== previousHash) {
                throw new Error(`Chain linkage broken at header ${i}`);
            }
        }

        previousHash = hashHex;
        console.log(`Header ${i} valid: ${hashHex}`);
    }
}
function readVarInt(buffer: Buffer, offset: number): { value: number; size: number } {
    const first = buffer[offset];

    if (first < 0xfd) {
        return { value: first, size: 1 };
    }

    if (first === 0xfd) {
        return { value: buffer.readUInt16LE(offset + 1), size: 3 };
    }

    if (first === 0xfe) {
        return { value: buffer.readUInt32LE(offset + 1), size: 5 };
    }

    const value = Number(buffer.readBigUInt64LE(offset + 1));
    return { value, size: 9 };
}
