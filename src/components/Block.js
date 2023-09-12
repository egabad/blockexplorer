import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import alchemy from '../alchemy';

function Block() {
  const { number } = useParams();
  const [timestamp, setTimestamp] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [gasLimit, setGasLimit] = useState('');
  const [hash, setHash] = useState('');
  const [parentHash, setParentHash] = useState('');
  const [miner, setMiner] = useState('');

  useEffect(() => {
    async function getData() {
      const block = await alchemy.core.getBlock(parseInt(number));
      setTimestamp((new Date(block.timestamp * 1000)).toLocaleString());
      setGasUsed(parseInt(block.gasUsed));
      setGasLimit(parseInt(block.gasLimit));
      setHash(block.hash);
      setParentHash(block.parentHash);
      setMiner(block.miner);
    }
    getData();
  }, []);

  return (<div>
    <nav><Link to="/">Home</Link></nav>
    <h1>Block {number}</h1>
    <h3>Timestamp: {timestamp}</h3>
    <h3>Gas Used: {gasUsed}</h3>
    <h3>Gas Limit: {gasLimit}</h3>
    <h3>Hash: {hash}</h3>
    <h3>Parent Hash: {parentHash}</h3>
    <h3>Miner: {miner}</h3>
  </div>);
}

export default Block;
