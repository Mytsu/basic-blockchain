"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sha256 = require("crypto-js/sha256");
var Block = /** @class */ (function () {
    function Block(index, timestamp, data, previousHash) {
        if (previousHash === void 0) { previousHash = ''; }
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return sha256(this.index.toString() + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    };
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [this.createGenesisBlock()];
    }
    Blockchain.prototype.createGenesisBlock = function () {
        return new Block(0, "01/01/2017", "Genesis Block", "0");
    };
    Blockchain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.addBlock = function (newblock) {
        newblock.previousHash = this.getLatestBlock().hash;
        newblock.hash = newblock.calculateHash();
        this.chain.push(newblock);
    };
    Blockchain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                return false;
            }
        }
        return true;
    };
    return Blockchain;
}());
var coin = new Blockchain();
coin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
coin.addBlock(new Block(2, "12/07/2017", { amount: 10 }));
console.log('Is blockchain valid? ' + coin.isChainValid());
coin.chain[1].data = { amount: 100 };
coin.chain[1].hash = coin.chain[1].calculateHash();
console.log('Is blockchain valid? ' + coin.isChainValid());
//console.log(JSON.stringify(coin, null, 4));
//# sourceMappingURL=block.js.map