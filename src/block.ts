/**
 * Code made by github.com/SavjeeTutorials
 * Translated to typescript by github.com/Mytsu
 */

import {
    SHA256
} from 'crypto-js';
import {
    ec
} from 'elliptic';

const secp = new ec('secp256k1');

export class Transaction {

    private signature: ec.Signature;

    constructor(public fromAddress: string, public toAddress: string, public amount: number) {}

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey: ec.KeyPair) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig;
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.toDER('hex').length === 0)
            throw new Error('No signature in this transaction!');
        const publicKey = secp.keyFromPublic( < Buffer > < unknown > this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export class Block {

    public hash: string;

    constructor(public timestamp: string, public transactions: Transaction[], public previousHash: string = '', public nonce: number = 0, public log: boolean = false) {
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
        if (this.log)
            console.log("Block mined: " + this.hash);
    }

    hasValidTransactions(): boolean {
        this.transactions.forEach((tx) => {
            if (!tx.isValid())
                return false;
        });
        return true;
    }
}

export class Blockchain {

    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];
    public miningReward = 100;

    constructor(public log: boolean = false) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    createGenesisBlock(): Block {
        return new Block(Date.parse("2018-12-16").toString(), [], "0", 0, this.log);
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string): void {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now().toString(), this.pendingTransactions, null, 0, this.log);
        block.mineBlock(this.difficulty);

        if (this.log)
            console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.fromAddress || !transaction.toAddress)
            throw new Error('Transaction must include from and to addresses');

        if (!transaction.isValid())
            throw new Error('Cannot add an invalid transaction to the chain');

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.fromAddress === address)
                    balance -= transaction.amount;

                if (transaction.toAddress === address)
                    balance += transaction.amount;
            });
        });
        return balance;
    }

    isChainValid(): boolean {

        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0]))
            return false;
        else if (realGenesis === JSON.stringify(this.chain[0]))
            return true;

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions())
                return false;

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if (currentBlock.previousHash !== previousBlock.calculateHash())
                return false;
        }
        return true;
    }
}