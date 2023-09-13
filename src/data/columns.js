import React from 'react';

export const blockTableColumns = [
  {
    Header: 'Block #',
    accessor: 'blockNum',
    // eslint-disable-next-line
    Cell: ({ value }) => <a href={`block/${value}`}>{value}</a>,
  },
  {
    Header: 'Miner',
    accessor: 'miner',
  },
  {
    Header: 'Transactions',
    accessor: 'transactions',
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
  },
];

export const txTableColumns = [
  {
    Header: 'Transaction Hash',
    accessor: 'hash',
    // eslint-disable-next-line
    Cell: ({ value }) => <a href={`transaction/${value}`}>{value}</a>,
  },
  {
    Header: 'From',
    accessor: 'from',
  },
  {
    Header: 'To',
    accessor: 'to',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
];
