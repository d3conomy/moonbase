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

### Command Deck
- Executes commands on pods

## Notes
- Cannot assign two IPFS (Helia) processes to the same Lib2p2 process
- Cannot assign two OrbitDB processes to the same IPFS process; levelDb errors.