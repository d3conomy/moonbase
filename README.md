# Moonbase

> API server backend for OrbtiDB, IPFS, and Libp2p

## Quick Start

### Installation

```bash
npm install moonbase-js
```

### Usage

Start the Moonbase API server:
```typescript
import { Moonbase } from 'moonbase-js';

const moonbase = new Moonbase();
moonbase.init();
```

Confirm that the server is running by checking the console output:
```text
Moonbase🌙⛺️ API Server listening on port 4343
```

Open your web browser to `http://localhost:4343/api/v0/docs` to see the API documentation.



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
- [Moonbase](https://docs.d3conomy.com/modules/Moonbase.html)