import { useEffect, useState } from 'react';
import Table from "./Table";
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
      setGasPrice(weiToGwei(feeData.maxFeePerGas, 2) + ' gwei');
      
      // Get latest block
      const block = await alchemy.core.getBlock('latest');
      setBlockNumber(block.number);
      setDifficulty(block.difficulty);
      setGasUsed(parseInt(block.gasUsed));
      setGasLimit(parseInt(block.gasLimit));
      
      // Get latest transactions
      const latestFive = block.transactions.slice(0, numTxDisplay);
      let transactions = [];
      for (const txHash of latestFive) {
        try {
          const transaction = await alchemy.core.getTransactionReceipt(txHash);
          transactions.push({
            hash: transaction.transactionHash,
            from: transaction.from,
            to: transaction.to,
            status: transaction.status,
          });
        } catch (error) {
          console.error(`Error getting tx ${txHash}: ${error.message}`);
        }
      }
      setTxData(transactions);

      // Get latest blocks
      let blocks = [];
      let currBlock = block;
      const currBlockNum = block.number;
      let prevBlockNum = currBlockNum;
      while (prevBlockNum > currBlockNum - numTxDisplay) {
        blocks.push({
          blockNum: currBlock.number,
          miner: currBlock.miner,
          transactions: currBlock.transactions.length,
          timestamp: (new Date(currBlock.timestamp * 1000)).toLocaleString(),
        });
        prevBlockNum--;
        if (prevBlockNum > currBlockNum - numTxDisplay) {
          try {
            currBlock = await alchemy.core.getBlock(prevBlockNum);
          } catch (error) {
            console.error(`Error getting block ${currBlock}: ${error.message}`);
          }
        }
      }
      setBlocksData(blocks);
    }
    getData();
  }, []);

  return (<div className="App">
    <h2> Gas Price Estimate: {gasPrice} </h2>
    <h1>===Latest Block Data===</h1>
    <h3> Block Number: {blockNumber} </h3>
    <h3> Gas Used: {gasUsed} </h3>
    <h3> Gas Limit: {gasLimit} </h3>
    <h3> Difficulty: {difficulty} </h3>
    <h1>===Latest Blocks===</h1>
    <Table columns={blockTableColumns} data={blocksData}/>
    <h1>===Latest Transactions===</h1>
    <Table columns={txTableColumns} data={txData}/>
  </div>);
}

export default Home;
