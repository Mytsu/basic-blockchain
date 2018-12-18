import { Block, Blockchain, Transaction } from './block';
import { expect } from 'chai';
import 'mocha';
import { ec } from 'elliptic';



describe('Block', () => {

    let block: Block;
    
    describe('block: calculateHash', () => {        

        before(() => {
            block = new Block(Date.now().toString(), [], 'random-hash');
        });

        it('should return a string', () => {
            return expect(block.calculateHash()).to.be.a('string');
        });
    });
    
    describe('block: mineBlock', () => {

        before(() => {
            block = new Block(Date.now().toString(), [], 'random-hash');
            let difficulty = 2;
            block.mineBlock(difficulty);
        });    
    
        it('should update hash attr', () => {
            return expect(block.hash).to.be.a('string');
        });
    });
});

describe('e2e', () => {
    
    const EC = new ec('secp256k1');

    let blockchain: Blockchain;

    const myKey: ec.KeyPair = EC.keyFromPrivate(<ec.KeyPair><unknown>'7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
    const myWallet: string = myKey.getPublic('hex');

    before(() => {        

        blockchain = new Blockchain();

        const tx1 = new Transaction(myWallet, 'public key goes here', 10);        

        tx1.signTransaction(myKey);
        blockchain.addTransaction(tx1);

        // starting miner
        blockchain.minePendingTransactions(myWallet);

    });

    it('wallet should have 90', () => {
        return expect(blockchain.getBalanceOfAddress(myWallet).toString()).to.contain('90');
    });

    it('chain should be valid', () => {
        return expect(blockchain.isChainValid()).true;
    })
});