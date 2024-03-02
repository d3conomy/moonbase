// import { _OrbitDbOptions, OrbitDbProcess } from '../db/orbitDb.js';
// import { _IpfsOptions, IpfsProcess } from '../db/ipfs.js';
// import { Libp2pProcess } from '../db/libp2p.js';

// import { expect } from 'chai';

// describe('CreateOrbitDbProcess', async () => {
//     let libp2p: Libp2pProcess;
//     let ipfs: IpfsProcess;
//     let orbitDb: OrbitDbProcess;

//     it('should create an OrbitDb instance with the provided options', async () => {
//         // Create a mock libp2p instance
//         libp2p = new Libp2pProcess({});
//         await libp2p.init();

//         // Create the options object
//         const options: _IpfsOptions = new _IpfsOptions({
//             libp2p,
//         });

//         // Call the createIpfsProcess function
//         ipfs = new IpfsProcess({ options });
//         await ipfs.init();

//         // Create the OrbitDb Options
//         const orbitDbOptions = new _OrbitDbOptions({
//             ipfs,
//         });

//         // Call the createOrbitDbProcess function
//         orbitDb = new OrbitDbProcess({ options: orbitDbOptions});
//         await orbitDb.init();

//         // Assert that the OrbitDb instance is created successfully
//         expect(orbitDb.process?.ipfs).to.be.an('object');
//         // Add more assertions based on your specific requirements

//         // Clean up
//         await orbitDb.process?.stop();
//         await orbitDb.process?.ipfs.stop();
//         await orbitDb.process?.ipfs.libp2p.stop();
//     });
// });
