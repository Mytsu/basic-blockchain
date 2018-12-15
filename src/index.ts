import { Block, Blockchain } from './block';

let coin = new Blockchain();
coin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
coin.addBlock(new Block(2, "12/07/2017", { amount: 10 }));

console.log('Is blockchain valid? ' + coin.isChainValid());

coin.chain[1].data = { amount: 100 };
coin.chain[1].hash = coin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + coin.isChainValid());

//console.log(JSON.stringify(coin, null, 4));