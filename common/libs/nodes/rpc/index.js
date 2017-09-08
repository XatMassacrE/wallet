// @flow
import Big from 'bignumber.js';
import { addHexPrefix } from 'ethereumjs-util';
import translate from 'translations';
import BaseNode from '../base';
import type {
  TransactionWithoutGas,
  Transaction,
  BroadcastTransaction,
  SendfRawTransactionRequest
} from 'libs/transaction';
import RPCClient, {
  getBalance,
  estimateGas,
  ethCall,
  sendRawTransaction,
  getTransactionCount,
  getTxByHash
} from './client';
import type { Token } from 'config/data';
import ERC20 from 'libs/erc20';
import type { BaseWallet } from 'libs/wallet';
import { toWei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { EthCallTransaction, CompleteTransaction } from '../../transaction';

export default class RpcNode extends BaseNode {
  client: RPCClient;

  constructor(endpoint: string) {
    super();
    this.client = new RPCClient(endpoint);
  }

  async getBalance(address: string): Promise<Big> {
    return this.client.call(getBalance(address)).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      return new Big(Number(this.formatResult(response.result)));
    });
  }

  async estimateGas(transaction: TransactionWithoutGas): Promise<Big> {
    return this.client.call(estimateGas(transaction)).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      return new Big(Number(this.formatResult(response.result)));
    });
  }

  async getAllowance(transaction: EthCallTransaction): Promise<Big> {
    return this.client.call(ethCall(transaction)).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      return new Big(Number(this.formatResult(response.result)));
    });
  }

  async sendSingedTransaction(singedTx: string): Promise<string> {
    return this.client.call(sendRawTransaction(singedTx)).then(response => {
      console.log(response);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return new response.result();
    });
  }

  async getTxByHash(hash: string): Promise<CompleteTransaction> {
    return this.client.call(getTxByHash(hash)).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      return new CompleteTransaction(response.result);
    });
  }

  async checkTxisinBlock(hash: string): Promise<boolean> {
    return this.client.call(getTxByHash(hash)).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      return !!new CompleteTransaction(response.result).blockHash;
    });
  }

  async getTokenBalances(address: string, tokens: Token[]): Promise<Big[]> {
    const data = ERC20.balanceOf(address);
    return this.client
      .batch(
        tokens.map(t =>
          ethCall({
            to: t.address,
            data
          })
        )
      )
      .then(response => {
        return response.map((item, idx) => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return new Big(0);
          }
          return new Big(Number(this.formatResult(item.result))).div(
            new Big(10).pow(tokens[idx].decimal)
          );
        });
      });
  }

  formatResult = (sour: string) => {
    if (sour === '0x') {
      sour = sour + '0';
    }

    return sour;
  };

  async generateTransaction(
    tx: Transaction,
    wallet: BaseWallet
  ): Promise<BroadcastTransaction> {
    // Reject bad addresses
    if (!isValidETHAddress(tx.to)) {
      return Promise.reject(new Error(translate('ERROR_5')));
    }

    // Reject gas limit under 21000 (Minimum for transaction)
    // Reject if limit over 5000000
    // TODO: Make this dynamic, the limit shifts
    const limitBig = new Big(tx.gasLimit);
    if (limitBig.lessThan(21000)) {
      return Promise.reject(
        new Error(
          translate('Gas limit must be at least 21000 for transactions')
        )
      );
    }

    if (limitBig.greaterThan(5000000)) {
      return Promise.reject(new Error(translate('GETH_GasLimit')));
    }

    // Reject gas over 1000gwei (1000000000000)
    const priceBig = new Big(tx.gasPrice);
    if (priceBig.greaterThan(new Big('1000000000000'))) {
      return Promise.reject(
        new Error(
          'Gas price too high. Please contact support if this was not a mistake.'
        )
      );
    }

    const calls = [getBalance(tx.from), getTransactionCount(tx.from)];

    return this.client.batch(calls).then(async results => {
      const [balance, txCount] = results;

      if (balance.error) {
        throw new Error(`Failed to retrieve balance for ${tx.from}`);
      }

      if (txCount.error) {
        throw new Error(`Failed to retrieve transaction count for ${tx.from}`);
      }

      // TODO: Handle token values
      const valueWei = new Big(toWei(new Big(tx.value), 'ether'));
      const balanceWei = new Big(balance.result);
      if (valueWei.gte(balanceWei)) {
        // throw new Error(translate('GETH_Balance'));
      }

      const rawTx = {
        nonce: addHexPrefix(txCount.result),
        gasPrice: addHexPrefix(new Big(tx.gasPrice).toString(16)),
        gasLimit: addHexPrefix(new Big(tx.gasLimit).toString(16)),
        to: addHexPrefix(tx.to),
        value: addHexPrefix(valueWei.toString(16)),
        data: tx.data ? addHexPrefix(tx.data) : '',
        chainId: tx.chainId || 1
      };

      const rawTxJson = JSON.stringify(rawTx);
      const signedTx = await wallet.signRawTransaction(rawTx);

      // Repeat all of this shit for Flow typechecking. Sealed objects don't
      // like spreads, so we have to be explicit.
      return {
        nonce: rawTx.nonce,
        gasPrice: rawTx.gasPrice,
        gasLimit: rawTx.gasLimit,
        to: rawTx.to,
        value: rawTx.value,
        data: rawTx.data,
        chainId: rawTx.chainId,
        rawTx: rawTxJson,
        signedTx: signedTx
      };
    });
  }

  async generateTransactionWithNonce(
    tx: Transaction,
    wallet: BaseWallet,
    nonce: string
  ): Promise<BroadcastTransaction> {
    // Reject bad addresses
    if (!isValidETHAddress(tx.to)) {
      return Promise.reject(new Error(translate('ERROR_5')));
    }

    // Reject gas limit under 21000 (Minimum for transaction)
    // Reject if limit over 5000000
    // TODO: Make this dynamic, the limit shifts
    const limitBig = new Big(tx.gasLimit);
    if (limitBig.lessThan(21000)) {
      return Promise.reject(
        new Error(
          translate('Gas limit must be at least 21000 for transactions')
        )
      );
    }

    if (limitBig.greaterThan(5000000)) {
      return Promise.reject(new Error(translate('GETH_GasLimit')));
    }

    // Reject gas over 1000gwei (1000000000000)
    const priceBig = new Big(tx.gasPrice);
    if (priceBig.greaterThan(new Big('1000000000000'))) {
      return Promise.reject(
        new Error(
          'Gas price too high. Please contact support if this was not a mistake.'
        )
      );
    }

    const calls = [getBalance(tx.from)];

    return this.client.batch(calls).then(async results => {
      const [balance] = results;

      if (balance.error) {
        throw new Error(`Failed to retrieve balance for ${tx.from}`);
      }

      // TODO: Handle token values
      const valueWei = new Big(toWei(new Big(tx.value), 'ether'));
      const balanceWei = new Big(balance.result);
      if (valueWei.gte(balanceWei)) {
        // throw new Error(translate('GETH_Balance'));
      }

      const rawTx = {
        nonce: addHexPrefix(nonce),
        gasPrice: addHexPrefix(new Big(tx.gasPrice).toString(16)),
        gasLimit: addHexPrefix(new Big(tx.gasLimit).toString(16)),
        to: addHexPrefix(tx.to),
        value: addHexPrefix(valueWei.toString(16)),
        data: tx.data ? addHexPrefix(tx.data) : '',
        chainId: tx.chainId || 1
      };

      const rawTxJson = JSON.stringify(rawTx);
      const signedTx = await wallet.signRawTransaction(rawTx);

      // Repeat all of this shit for Flow typechecking. Sealed objects don't
      // like spreads, so we have to be explicit.
      return {
        nonce: rawTx.nonce,
        gasPrice: rawTx.gasPrice,
        gasLimit: rawTx.gasLimit,
        to: rawTx.to,
        value: rawTx.value,
        data: rawTx.data,
        chainId: rawTx.chainId,
        rawTx: rawTxJson,
        signedTx: signedTx
      };
    });
  }
}
