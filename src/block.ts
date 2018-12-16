/**
 * Code made by github.com/SavjeeTutorials
 */

import { SHA256 } from 'crypto-js';

export class Transaction {
    constructor(public fromAddress: string, public toAddress: string, public amount: number) {}
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
        return new Block("01/01/2017", Array(new Transaction("Genesis Block", "Genesis Transaction", 0)), "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string): void {
        let block = new Block(Date.now().toString(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
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
