export type LoopringOrder = {
  hash: string,
  protocol: string, // contract address of Loopring Protocol
  owner: string, // owner address
  outToken: string, // contract address of token to sell
  inToken: string, // contract address of token to buy
  outAmount: string, // up limit of token amount  to sell
  inAmount: string, // down limit of token amount to buy
  expiration: string, // expiration timestamp
  fee: string, // order fee
  savingShare: string,
  v: number,
  r: string,
  s: string
};
