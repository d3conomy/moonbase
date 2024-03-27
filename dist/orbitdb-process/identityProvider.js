import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did';
import KeyDidResolver from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { useIdentityProvider } from '@orbitdb/core';
import { logger, Component, LogLevel, ResponseCode } from '../../utils/index.js';
/**
 * Create an identity provider
 * @category OrbitDb
 * @todo Add support for other identity providers
 * @todo Add support for other identity seeds
 */
const createIdentityProvider = ({ identitySeed, identityProvider } = {}) => {
    if (!identitySeed) {
        logger({
            level: LogLevel.WARN,
            name: Component.ORBITDB,
            code: ResponseCode.NOT_FOUND,
            message: `No identity seed provided. Using hardcoded seed...`
        });
        identitySeed = new Uint8Array([
            157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245,
            222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188,
            87, 191, 33, 95, 58, 136, 46, 218, 219, 245
        ]);
    }
    OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver());
    useIdentityProvider(OrbitDBIdentityProviderDID);
    const didProvider = new Ed25519Provider(identitySeed);
    identityProvider = OrbitDBIdentityProviderDID({ didProvider });
    return identityProvider;
};
export { createIdentityProvider };
