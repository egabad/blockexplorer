import React, { useEffect, useState } from 'react';
import Table from './Table';
import alchemy from '../alchemy';
import { blockTableColumns, txTableColumns } from '../data/columns';
import { weiToGwei } from '../utils';

function Home() {
  const [gasPrice, setGasPrice] = useState('- gwei');
  const [blockNumber, setBlockNumber] = useState('-');
  const [gasLimit, setGasLimit] = useState('-');
  const [gasUsed, setGasUsed] = useState('-');
  const [difficulty, setDifficulty] = useState('-');
  const [blocksData, setBlocksData] = useState([{
    blockNum: '',
    miner: '',
    transactions: '',
    timestamp: '',
  }]);
  const [txData, setTxData] = useState([{
    hash: '',
    from: '',
    to: '',
    status: '',
  }]);
  const numTxDisplay = 5;

  useEffect(() => {
    async function getData() {
      // Get gas price
      const feeData = await alchemy.core.getFeeData();
      setGasPrice(`${weiToGwei(feeData.maxFeePerGas, 2)} gwei`);

      // Get latest block
      const block = await alchemy.core.getBlock('latest');
      setBlockNumber(block.number);
      setDifficulty(block.difficulty);
      setGasUsed(parseInt(block.gasUsed, 10));
      setGasLimit(parseInt(block.gasLimit, 10));

      // Get latest transactions
      const latestFive = block.transactions.slice(0, numTxDisplay);
      const txPromises = latestFive.map((hash) => alchemy.core.getTransactionReceipt(hash));
      const txsRaw = await Promise.all(txPromises);
      const transactions = txsRaw.map((transaction) => ({
        hash: transaction.transactionHash,
        from: transaction.from,
        to: transaction.to,
        status: transaction.status,
      }));
      setTxData(transactions);

      // Get latest blocks
      const blocksPromises = [];
      for (let i = block.number - 1; i > block.number - numTxDisplay; i -= 1) {
        blocksPromises.push(alchemy.core.getBlock(i));
      }
      const blocksRaw = [block]; // Add first block, then the rest
      (await Promise.all(blocksPromises)).map((blockPromise) => blocksRaw.push(blockPromise));
      const blocks = blocksRaw.map((blk) => ({
        blockNum: blk.number,
        miner: blk.miner,
        transactions: blk.transactions?.length,
        timestamp: (new Date(blk.timestamp * 1000)).toLocaleString(),
      }));
      setBlocksData(blocks);
    }
    getData();
  }, []);

  return (
    <div className="App">
      <h2>
        {' '}
        Gas Price Estimate:
        {gasPrice}
      </h2>
      <h1>===Latest Block Data===</h1>
      <h3>
        {' '}
        Block Number:
        {blockNumber}
      </h3>
      <h3>
        {' '}
        Gas Used:
        {gasUsed}
      </h3>
      <h3>
        {' '}
        Gas Limit:
        {gasLimit}
      </h3>
      <h3>
        {' '}
        Difficulty:
        {difficulty}
      </h3>
      <h1>===Latest Blocks===</h1>
      <Table columns={blockTableColumns} data={blocksData} />
      <h1>===Latest Transactions===</h1>
      <Table columns={txTableColumns} data={txData} />
    </div>
  );
}

export default Home;
