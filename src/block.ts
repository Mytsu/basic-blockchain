/**
 * Code made by github.com/SavjeeTutorials
 */

import * as sha256 from 'crypto-js/sha256'

export class Block {

    public hash: string;

    constructor(public index: number, public timestamp: string, public data: any, public previousHash: string = '', public nonce: number = 0) {
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty: number) {
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

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(): Block {
        return new Block(0, "01/01/2017", "Genesis Block", "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newblock: Block): void {
        newblock.previousHash = this.getLatestBlock().hash;
        newblock.mineBlock(this.difficulty);
        this.chain.push(newblock);
    }

    isChainValid() {
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
