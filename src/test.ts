import { Blockchain, Transaction } from './block';
import { ec } from 'elliptic';

const EC = new ec('secp256k1');

const myKey: ec.KeyPair = EC.keyFromPrivate(<ec.KeyPair><unknown>'7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
const myWallet: string = myKey.getPublic('hex');

let coin = new Blockchain();

const tx1 = new Transaction(myWallet, 'public key goes here', 10);

tx1.signTransaction(myKey);
coin.addTransaction(tx1);

console.log('\nStarting miner');
coin.minePendingTransactions(myWallet);

console.log('\nBalance of my account is: ', coin.getBalanceOfAddress(myWallet));

console.log('\nIs chain valid?', coin.isChainValid());
