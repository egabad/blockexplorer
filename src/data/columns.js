export const blockTableColumns = [
  {
    Header: "Block #",
    accessor: "blockNum",
    Cell: (props) => <a href={'block/' + props.value}>{props.value}</a>
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

export const txTableColumns = [
  {
    Header: "Transaction Hash",
    accessor: "hash",
    Cell: (props) => <a href={'transaction/' + props.value}>{props.value}</a>
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