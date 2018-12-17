# @mytsu/blockchain

![Stars](https://img.shields.io/github/stars/Mytsu/node-blockchain.svg?style=flat-square)
![Forks](https://img.shields.io/github/forks/Mytsu/node-blockchain.svg?style=flat-square)

Basic implementation of a blockchain. Made up with typescript while following @SavjeeTutorials [video](https://www.youtube.com/watch?v=zVqczFZr124).

As said by the original author, this is made for educational purpuses only. The project is made in Typescript to allow better readabillity.

## Install

```bash
npm i @mytsu/blockchain
```

## Usage

```typescript
import { Blockchain, Transaction } from './block';
import { ec } from 'elliptic';

const EC = new ec('secp256k1');

const myKey: ec.KeyPair = EC.keyFromPrivate(<ec.KeyPair><unknown>'your private key goes here');
const myWallet: string = myKey.getPublic('hex');

let coin = new Blockchain();

const tx1 = new Transaction(myWallet, 'destination wallet goes here', 10);

tx1.signTransaction(myKey);
coin.addTransaction(tx1);

console.log('\nStarting miner');
coin.minePendingTransactions(myWallet);

console.log('\nBalance of my account is: ', coin.getBalanceOfAddress(myWallet));

console.log('\nIs chain valid?', coin.isChainValid());

```

## Notes

You might notice the ```<ec.KeyPair><unknown>``` on the private key, it's _elliptic typings_ weird settings.
