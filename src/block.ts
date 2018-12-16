/**
 * Code made by github.com/SavjeeTutorials
 * Translated to typescript by github.com/Mytsu
 */

import { SHA256 } from 'crypto-js';
import { ec } from 'elliptic';

const secp = new ec('secp256k1');

export class Transaction {

    private signature: string;

    constructor(public fromAddress: string, public toAddress: string, public amount: number) {}

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey: ec.KeyPair) {
        if(signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) 
            throw new Error('No signature in this transaction!');

        const publicKey = secp.keyFromPublic(new Buffer(this.fromAddress), 'hex');
        return publicKey.verify(this.calculateHash(), <ec.Signature><unknown>this.signature); // have no f idea why @types/elliptic is so messy
    }
}

export class Block {

    public hash: string;

    constructor(public timestamp: string, public transactions: Transaction[], public previousHash: string = '', public nonce: number = 0) {
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty: number): void {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

export class Blockchain {

    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];
    public miningReward = 100;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    createGenesisBlock(): Block {
        return new Block(Date.parse("2018-12-16").toString(), [], "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string): void {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now().toString(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    createTransaction(transaction: Transaction): void {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if(transaction.fromAddress === address) 
                    balance -= transaction.amount;

                if(transaction.toAddress === address)
                    balance += transaction.amount;
            });
        });
        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
          const currentBlock = this.chain[i];
          const previousBlock = this.chain[i - 1];
    
          if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
          }
    
          if (currentBlock.previousHash !== previousBlock.calculateHash()) {
            return false;
          }
        }
    
        return true;
      }
}
