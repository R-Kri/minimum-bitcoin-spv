# minimal-bitcoin-spv

A minimal Bitcoin SPV client written from scratch in TypeScript. No Bitcoin libraries. Just raw TCP, byte buffers, and the Bitcoin P2P protocol.

Connects to a real testnet node, does the handshake, syncs block headers, and validates proof-of-work locally.


## What it does

- Opens a raw TCP connection to a Bitcoin testnet peer
- Implements the full P2P version handshake (`version` → `verack`)
- Sends `getheaders` and parses the response
- Validates each header: double SHA256, compact difficulty target, chain linkage
- Handles TCP stream fragmentation with a proper accumulator buffer + magic byte realignment
- Syncs 2000 headers per request and verifies all of them locally

## Why I built this

I wanted to understand Bitcoin at the protocol level — not through SDKs or libraries, but by actually implementing it.

So I built a client that speaks the P2P protocol directly. Framing messages by hand, parsing little-endian fields, decoding compact difficulty, comparing 256-bit hashes in JS. The works.

The most interesting problem I hit was TCP fragmentation. I initially assumed one `data` event = one complete message. That's wrong. Fixing it meant building a real message accumulator that buffers incoming bytes, validates magic bytes to realign the stream, and only parses once a full message has arrived.

## What I learned

- Bitcoin P2P message framing (magic bytes, command padding, checksum)
- Compact difficulty (`bits`) encoding and target expansion
- 256-bit integer comparison in JavaScript
- Little-endian vs big-endian throughout the protocol
- VarInt encoding/decoding
- TCP is a byte stream, not a message stream — and why that matters

## Project structure

```
src/
 ├── crypto/
 │   └── hash.ts          # double SHA256
 ├── block/
 │   ├── header.ts        # header parsing
 │   ├── difficulty.ts    # compact bits → target
 │   └── chain.ts         # PoW + linkage validation
 ├── network/
 │   ├── message.ts       # message framing
 │   └── client.ts        # TCP connection + protocol logic
 └── main.ts
```

## Run it

```bash
npm install
npx tsc
node dist/main.js
```

Connects to Bitcoin testnet and starts syncing headers.

## Example output

```
Connected to testnet node
Sent version message
Received command: version
Received version, sending verack
Received command: verack
Handshake complete ✅
Sent getheaders
Received command: headers
Header count: 2000
Header 0 valid: 00000000...
Header 1 valid: 00000000...
...
Header 1999 valid: 00000000...
```
