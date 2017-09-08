import Big from 'bignumber.js';

export type LoopringOrder = {
  protocol: string, // contract address of Loopring Protocol
  owner: string, // owner address
  outToken: string, // contract address of token to sell
  inToken: string, // contract address of token to buy
  outAmount: Big, // up limit of token amount  to sell
  inAmount: Big, // down limit of token amount to buy
  expiration: Big, // expiration timestamp
  fee: Big, // order fee
  savingShare: string,
  v: string,
  r: string,
  s: string
};
