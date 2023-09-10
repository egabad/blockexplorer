import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import Table from "./Table";
import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.MATIC_MUMBAI,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
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
      const feePerGas = Utils.formatUnits(feeData.maxFeePerGas, 'gwei')
      setGasPrice(parseFloat(feePerGas).toFixed(2) + ' gwei');
      
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

  const blockTableColumns = [
    {
      Header: "Block #",
      accessor: "blockNum",
    },
    {
      Header: "Miner",
      accessor: "miner",
    },
    {
      Header: "Transactions",
      accessor: "transactions",
    },
    {
      Header: "Timestamp",
      accessor: "timestamp",
    },
  ];

  const txTableColumns = [
    {
      Header: "Tx Hash",
      accessor: "hash",
    },
    {
      Header: "From",
      accessor: "from",
    },
    {
      Header: "To",
      accessor: "to",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

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

export default App;
