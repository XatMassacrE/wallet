import Big from 'bignumber.js';

export type LoopringOrder = {
  hash: string,
  protocol: string, // contract address of Loopring Protocol
  owner: string, // owner address
  outToken: string, // contract address of token to sell
  inToken: string, // contract address of token to buy
  outAmount: Big | number, // up limit of token amount  to sell
  inAmount: Big | number, // down limit of token amount to buy
  expiration: Big | number, // expiration timestamp
  fee: Big | number, // order fee
  savingShare: string,
  v: string,
  r: string,
  s: string
};
