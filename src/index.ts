import { Block, Blockchain } from './block';

let coin = new Blockchain();

console.log('Mining block 1');
coin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));

console.log('Mining block 2');
coin.addBlock(new Block(2, "12/07/2017", { amount: 10 }));