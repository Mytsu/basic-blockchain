import { Block, Blockchain, Transaction } from './block';

let coin = new Blockchain();

coin.createTransaction(new Transaction('ad1', 'ad2', 100));

coin.createTransaction(new Transaction('ad2', 'ad1', 50));

console.log('\nStarting miner...');
coin.minePendingTransactions('xavier-address');

console.log('\nBalance of xavier is: ' + coin.getBalanceOfAddress('xavier-address'));

console.log('\nStarting miner again...');
coin.minePendingTransactions('xavier-address');

console.log('\nBalance of xavier is: ' + coin.getBalanceOfAddress('xavier-address'));