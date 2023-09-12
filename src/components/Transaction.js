import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import alchemy from '../alchemy';
import { weiToGwei } from '../utils';

function Transaction() {
  const { hash } = useParams();
  const [blockNum, setBlockNum] = useState('');
  const [status, setStatus] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [cumulativeGasUsed, setCumulativeGasUsed] = useState('');

  useEffect(() => {
    async function getData() {
      const transaction = await alchemy.core.getTransactionReceipt(hash);
      setBlockNum(transaction.blockNumber);
      setStatus(transaction.status == 1 ? 'Success' : 'Fail');
      setTo(transaction.to);
      setFrom(transaction.from);
      setGasPrice(weiToGwei(transaction.effectiveGasPrice) + ' gwei');
      setGasUsed(parseInt(transaction.gasUsed));
      setCumulativeGasUsed(parseInt(transaction.cumulativeGasUsed));
    }
    getData();
  }, []);


  return (<div>
    <nav><Link to="/">Home</Link></nav>
    <h1>Transaction {hash}</h1>
    <h3>Block Number: <Link to={`/block/${blockNum}`}>{blockNum}</Link></h3>
    <h3>Status: {status}</h3>
    <h3>To: {to}</h3>
    <h3>From: {from}</h3>
    <h3>Gas Price: {gasPrice}</h3>
    <h3>Gas Used: {gasUsed}</h3>
    <h3>Cumulative Gas Used: {cumulativeGasUsed}</h3>
  </div>);
}

export default Transaction;