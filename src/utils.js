import { Utils } from 'alchemy-sdk';

export function weiToGwei(wei, precision = 9) {
  return parseFloat(Utils.formatUnits(wei, 'gwei')).toFixed(precision);
}
