import { ec } from 'elliptic';

const secp = new ec('secp256k1');

const key = secp.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('\nPrivate key: ' + privateKey + '\nPublic key: ' + publicKey);