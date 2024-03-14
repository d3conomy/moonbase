# Moonbase

> API server backend for OrbtiDB, IPFS, and Libp2p

## Components

### Processes
- `Libp2p` - Peer to peer networking
- `IPFS` - Interplanetary File System; requires Libp2p
- `OrbitDB` - Distributed database; requires IPFS
- `OpenDB` - Open database; requires OrbitDB

### Pods
- Operate a process stack

### Pod Bay
- Manages pods

### API
- Exposes the pods

## Docs

Build the docs using typedoc:

```sh
npx typedoc --out docs src
```