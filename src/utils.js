import { Utils } from 'alchemy-sdk';

// eslint-disable-next-line import/prefer-default-export
export function weiToGwei(wei, precision = 9) {
  return parseFloat(Utils.formatUnits(wei, 'gwei')).toFixed(precision);
}
