# @mytsu/blockchain

![Stars](https://img.shields.io/github/stars/Mytsu/node-blockchain.svg?style=flat-square)
![Forks](https://img.shields.io/github/forks/Mytsu/node-blockchain.svg?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/@mytsu/blockchain.svg?style=flat-square)

Basic implementation of a blockchain. Made up with typescript while following @SavjeeTutorials [video](https://www.youtube.com/watch?v=zVqczFZr124).

## Install

```bash
npm i @mytsu/blockchain
```

## Usage

```typescript
import { Block, Blockchain } from '@mytsu/blockchain';

let coin = new Blockchain();
coin.addBlock(new Block(1, "10/12/2018", { amount: 4 }));
coin.addBlock(new Block(2, "12/12/2018", { amount: 10 }));

console.log('Is blockchain valid? ' + coin.isChainValid());
```