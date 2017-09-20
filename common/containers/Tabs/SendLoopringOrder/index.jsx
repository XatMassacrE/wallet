// @flow

import React from 'react';
import translate from 'translations';
import { UnlockHeader } from 'components/ui';
import {
  AddressField,
  AllowanceAmountField,
  BuyAmountField,
  SellAmountField,
  CustomMessage,
  DataField,
  GasField,
  OrderSideBar,
  ConfirmationModal,
  LoopringTxFee,
  SaveSharing
} from './components';
import type { State as AppState } from 'reducers';
import { connect } from 'react-redux';
import BaseWallet from 'libs/wallet/base';
import customMessages from './messages';
import type { NetworkConfig, Token, NodeConfig } from 'config/data';
import { loopringContractAddressMap } from 'config/data';
import { isValidETHAddress } from 'libs/validators';
import {
  getGasPriceGwei,
  getNetworkConfig,
  getNodeLib,
  getNodeConfig
} from 'selectors/config';
import type { TokenBalance } from 'selectors/wallet';
import { getTokenBalances, getTokens } from 'selectors/wallet';
import Big from 'bignumber.js';
import { valueToHex } from 'libs/values';
import ERC20 from 'libs/erc20';
import type { RPCNode } from 'libs/nodes';
import type {
  BroadcastTransaction,
  TransactionWithoutGas
} from 'libs/transaction';
import type { UNIT } from 'libs/units';
import { toWei } from 'libs/units';
import { formatGasLimit } from 'utils/formatters';
import type { ShowNotificationAction } from 'actions/notifications';
import { showNotification } from 'actions/notifications';
import { sha3, setLengthLeft, toBuffer } from 'ethereumjs-util';

type State = {
  readOnly: boolean,
  to: string,
  buyAmount: string,
  sellAmount: string,
  allowAmount: string,
  buyUnit: UNIT,
  sellUnit: UNIT,
  allowUnit: UNIT,
  tokenSellAllowance: string,
  tokenAllowance: string,
  gasLimit: string,
  predata: string,
  data: string,
  gasChanged: boolean,
  showTxConfirm: boolean,
  showPreTxConfirm: boolean,
  showAllow: boolean,
  loopringTxFee: string,
  savingShare: string,
  pretransaction: ?BroadcastTransaction,
  transaction: ?BroadcastTransaction
};

type Props = {
  location: {
    query: {
      [string]: string
    }
  },
  wallet: BaseWallet,
  balance: Big,
  nodeLib: RPCNode,
  node: NodeConfig,
  network: NetworkConfig,
  tokens: Token[],
  tokenBalances: TokenBalance[],
  gasPrice: number,
  showNotification: (
    level: string,
    msg: string,
    duration?: number
  ) => ShowNotificationAction
};

export class SendExchange extends React.Component {
  props: Props;
  state: State = {
    readOnly: false,
    buyAmount: '',
    sellAmount: '',
    allowAmount: '',
    buyUnit: 'LRC',
    sellUnit: 'LRC',
    allowUnit: 'LRC',
    gasLimit: '21000',
    predata: '',
    data: '',
    tokenSellAllowance: '0',
    tokenAllowance: '0',
    gasChanged: false,
    showTxConfirm: false,
    showPreTxConfirm: false,
    showAllow: false,
    loopringTxFee: '2',
    savingShare: '50',
    transaction: null,
    pretransaction: null
  };

  componentDidMount() {}

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (
      !this.state.gasChanged &&
      this.isValid() &&
      (this.state.to !== prevState.to ||
        this.state.value !== prevState.value ||
        this.state.unit !== prevState.unit ||
        this.state.data !== prevState.data)
    ) {
      this.estimateGas();
    }
  }

  render() {
    const unlocked = !!this.props.wallet;
    const {
      to,
      buyAmount,
      sellAmount,
      allowAmount,
      buyUnit,
      sellUnit,
      allowUnit,
      gasLimit,
      predata,
      data,
      readOnly,
      showTxConfirm,
      showAllow,
      tokenSellAllowance,
      tokenAllowance,
      pretransaction,
      loopringTxFee,
      savingShare,
      transaction
    } = this.state;
    const customMessage = customMessages.find(m => m.to === to);

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active">
            <UnlockHeader title={'NAV_SendLoopringOrder'} view={false} />

            {unlocked &&
              <article className="row">
                <section className="col-sm-5">
                  <div style={{ maxWidth: 720 }}>
                    <OrderSideBar
                      sellToken={this.props.tokens.find(
                        x => x.symbol === this.state.sellUnit
                      )}
                      buyToken={this.props.tokens.find(
                        x => x.symbol === this.state.buyUnit
                      )}
                    />
                    <hr />
                  </div>
                </section>
                <section className="col-sm-7">
                  <div className="row form-group">
                    <h4 className="col-xs-12">
                      {translate('SEND_trans')}
                    </h4>
                  </div>
                  <SellAmountField
                    value={sellAmount}
                    unit={sellUnit}
                    tokens={this.props.tokenBalances
                      // .filter(token => !token.balance.eq(0))
                      .map(token => token.symbol)
                      .sort()}
                    allowance={tokenSellAllowance}
                    toAllow={this.toAllow}
                    onChange={readOnly ? void 0 : this.onSellAmountChange}
                  />
                  <BuyAmountField
                    value={buyAmount}
                    unit={buyUnit}
                    tokens={this.props.tokenBalances
                      // .filter(token => !token.balance.eq(0))
                      .map(token => token.symbol)
                      .sort()}
                    onChange={readOnly ? void 0 : this.onBuyAmountChange}
                  />

                  <LoopringTxFee
                    value={loopringTxFee}
                    onChange={this.onLoopringTxFeeChange}
                  />

                  <SaveSharing
                    value={savingShare}
                    onChange={this.onSaveShareChange}
                  />
                  <br />
                  <br />
                  <div className="form-group">
                    <a
                      className="btn btn-primary btn-block col-sm-11"
                      onClick={this.submitTx}
                    >
                      {translate('Submit_tx')}
                    </a>
                  </div>
                </section>
                {showAllow &&
                  <section className="col-sm-7">
                    <div className="row form-group">
                      <h4 className="col-xs-12">
                        {translate('Approve_Allowance')}
                      </h4>
                    </div>
                    <AddressField value={loopringContractAddressMap.ETH} />
                    <AllowanceAmountField
                      title="Allow_amount"
                      value={allowAmount}
                      allowance={tokenAllowance}
                      unit={allowUnit}
                      tokens={this.props.tokenBalances
                        // .filter(token => !token.balance.eq(0))
                        .map(token => token.symbol)
                        .sort()}
                      onChange={
                        readOnly ? void 0 : this.onAllowanceAmountChange
                      }
                    />
                    <GasField
                      value={gasLimit}
                      onChange={readOnly ? void 0 : this.onGasChange}
                    />
                    <DataField
                      value={data}
                      preValue={predata}
                      hasPreValue={Number(tokenAllowance) !== 0}
                    />
                    <CustomMessage message={customMessage} />

                    <div className="row form-group">
                      <div className="col-xs-12 clearfix">
                        <a
                          className="btn btn-info btn-block"
                          onClick={this.generateTx}
                        >
                          {translate('SEND_generate')}
                        </a>
                      </div>
                    </div>

                    <div className="row form-group">
                      {Number(tokenAllowance) !== 0 &&
                        <div className="col-sm-6">
                          <label>
                            {translate('Set_allow_to_value')} 0
                          </label>
                          <textarea
                            className="form-control"
                            value={pretransaction ? pretransaction.rawTx : ''}
                            rows="4"
                            readOnly
                          />
                        </div>}
                      <div className="col-sm-6">
                        <label>
                          {translate('Set_allow_to_value')} {allowAmount}
                        </label>
                        <textarea
                          className="form-control"
                          value={transaction ? transaction.rawTx : ''}
                          rows="4"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <a
                        className="btn btn-primary btn-block col-sm-11"
                        onClick={this.openTxModal}
                      >
                        {translate('SEND_trans')}
                      </a>
                    </div>
                  </section>}
              </article>}
          </main>
        </div>
        {transaction &&
          showTxConfirm &&
          <ConfirmationModal
            wallet={this.props.wallet}
            node={this.props.node}
            signedTransaction={transaction.signedTx}
            allowanceValue={this.state.allowAmount}
            onCancel={this.cancelTx}
            onConfirm={this.confirmTx}
          />}
      </section>
    );
  }

  isValid() {
    const { allowAmount } = this.state;
    return (
      isValidETHAddress(loopringContractAddressMap.ETH) &&
      allowAmount &&
      Number(allowAmount) >= 0 &&
      !isNaN(Number(allowAmount)) &&
      isFinite(Number(allowAmount))
    );
  }

  async getTransactionFromState(): Promise<TransactionWithoutGas> {
    const { wallet } = this.props;

    if (this.state.unit === 'ether') {
      return {
        to: this.state.to,
        from: await wallet.getAddress(),
        value: valueToHex(this.state.value)
      };
    }
    const token = this.props.tokens.find(
      x => x.symbol === this.state.allowUnit
    );
    if (!token) {
      throw new Error('No matching token');
    }

    return {
      to: token.address,
      from: await wallet.getAddress(),
      value: '0x0',
      data: ERC20.transfer(
        this.state.to,
        new Big(this.state.value).times(new Big(10).pow(token.decimal))
      )
    };
  }

  async estimateGas() {
    const trans = await this.getTransactionFromState();
    if (!trans) {
      return;
    }
    const state = this.state;
    this.props.nodeLib.estimateGas(trans).then(gasLimit => {
      if (this.state === state) {
        this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
      }
    });
  }

  onGasChange = (value: string) => {
    this.setState({ gasLimit: value, gasChanged: true });
  };

  onAllowanceAmountChange = async (value: string, unit: string) => {
    let toAddress = '';
    let data;
    const tokenBalance = this.props.tokenBalances.find(
      token => token.symbol === unit
    );
    if (!tokenBalance) {
      return;
    }
    if (value === 'everything') {
      value = tokenBalance.balance.toString();
    }

    if (value > tokenBalance.balance) {
      value = tokenBalance.balance.toString();
      this.props.showNotification(
        'warning',
        'insufficient token balance',
        2000
      );
    }

    const method =
      '0x' + sha3('approve(address, uint256)').toString('hex').slice(0, 8);
    const address = setLengthLeft(
      toBuffer(loopringContractAddressMap.ETH),
      32
    ).toString('hex');

    data =
      method +
      address +
      setLengthLeft(toBuffer('0x' + parseInt(value).toString(16)), 32).toString(
        'hex'
      );
    let predata =
      method +
      address +
      setLengthLeft(toBuffer('0x' + parseInt('0').toString(16)), 32).toString(
        'hex'
      );

    if (!value || value === '') {
      data =
        method +
        address +
        setLengthLeft(toBuffer('0x' + parseInt('0').toString(16)), 32).toString(
          'hex'
        );
    }

    const token = this.props.tokens.find(token => token.symbol === unit);
    let allowance = '0';
    if (token) {
      toAddress = token.address;
      const address = await this.props.wallet.getAddress();
      const method =
        '0x' + sha3('allowance(address, address)').toString('hex').slice(0, 8);
      const owner = setLengthLeft(toBuffer(address), 32).toString('hex');
      const spender = setLengthLeft(
        toBuffer(loopringContractAddressMap.ETH),
        32
      ).toString('hex');
      allowance = (await this.props.nodeLib.getAllowance({
        to: toAddress,
        data: method + owner + spender
      })).toString();

      this.setState({
        to: toAddress,
        tokenAllowance: allowance,
        allowAmount: value,
        allowUnit: unit,
        predata: predata,
        data: data
      });
    }
  };

  onBuyAmountChange = (value: string, unit: string) => {
    this.setState({
      buyAmount: value,
      buyUnit: unit
    });
  };

  onSellAmountChange = async (value: string, unit: string) => {
    const token = this.props.tokens.find(token => token.symbol === unit);
    if (!token) {
      return;
    }
    const contractAddress = token.address;
    const address = await this.props.wallet.getAddress();
    const method =
      '0x' + sha3('allowance(address, address)').toString('hex').slice(0, 8);
    const owner = setLengthLeft(toBuffer(address), 32).toString('hex');
    const spender = setLengthLeft(
      toBuffer(loopringContractAddressMap.ETH),
      32
    ).toString('hex');
    const allowance = (await this.props.nodeLib.getAllowance({
      to: contractAddress,
      data: method + owner + spender
    })).toString();

    if (value === 'everything') {
      value = allowance;
    }

    this.setState({
      tokenSellAllowance: allowance,
      sellAmount: value,
      sellUnit: unit
    });
  };

  generateTx = async () => {
    const { nodeLib, wallet } = this.props;
    const address = await wallet.getAddress();
    try {
      if (Number(this.state.tokenAllowance) === 0) {
        const transaction = await nodeLib.generateTransaction(
          {
            to: this.state.to,
            from: address,
            value: '0',
            gasLimit: this.state.gasLimit,
            gasPrice: this.props.gasPrice,
            data: this.state.data,
            chainId: this.props.network.chainId
          },
          wallet
        );

        if (this.props.balance < this.state.gasLimit * this.props.gasPrice) {
          this.props.showNotification(
            'danger',
            'insufficient ETH balance for transaction fee',
            5000
          );
        } else {
          this.setState({ transaction });
        }
      } else {
        const pretransaction = await nodeLib.generateTransaction(
          {
            to: this.state.to,
            from: address,
            value: '0',
            gasLimit: this.state.gasLimit,
            gasPrice: this.props.gasPrice,
            data: this.state.predata,
            chainId: this.props.network.chainId
          },
          wallet
        );
        const transaction = await nodeLib.generateTransactionWithNonce(
          {
            to: this.state.to,
            from: address,
            value: '0',
            gasLimit: this.state.gasLimit,
            gasPrice: this.props.gasPrice,
            data: this.state.data,
            chainId: this.props.network.chainId
          },
          wallet,
          (Number(pretransaction.nonce) + 1).toString(16)
        );

        if (
          this.props.balance <
          this.state.gasLimit * this.props.gasPrice * 2
        ) {
          this.props.showNotification(
            'danger',
            'insufficient ETH balance for transaction fee',
            5000
          );
        } else {
          this.setState({ transaction, pretransaction });
        }
      }
    } catch (err) {
      this.props.showNotification('danger', err.message, 2000);
    }
  };

  toAllow = () => {
    this.setState({
      showAllow: true
    });
  };

  openTxModal = () => {
    if (this.state.pretransaction) {
      this.setState({ showPreTxConfirm: true });
    } else if (this.state.transaction) {
      this.setState({ showTxConfirm: true });
    }
  };

  cancelTx = () => {
    this.setState({ showTxConfirm: false });
  };

  confirmTx = async (rawtx: string, tx: EthTx) => {
    try {
      await this.props.nodeLib.sendSingedTransaction(rawtx);
      this.setState({
        readOnly: false,
        buyAmount: '',
        sellAmount: '',
        allowAmount: '',
        buyUnit: 'LRC',
        sellUnit: 'LRC',
        allowUnit: 'LRC',
        gasLimit: '21000',
        predata: '',
        data: '',
        tokenSellAllowance: '0',
        tokenAllowance: '0',
        gasChanged: false,
        showTxConfirm: false,
        showPreTxConfirm: false,
        showAllow: false,
        transaction: null,
        pretransaction: null
      });
    } catch (err) {
      this.setState({ showTxConfirm: false, showPreTxConfirm: false });
      this.props.showNotification('danger', err.message, 2000);
    }
  };

  submitTx = async () => {
    const { buyAmount, sellAmount } = this.state;
    const valid =
      buyAmount &&
      sellAmount &&
      Number(buyAmount) > 0 &&
      Number(sellAmount) > 0 &&
      !isNaN(Number(buyAmount)) &&
      !isNaN(Number(sellAmount)) &&
      isFinite(Number(buyAmount)) &&
      isFinite(Number(sellAmount));

    if (!valid) {
      this.props.showNotification('danger', 'illegal inputs', 2000);
      return;
    }
    const token = this.props.tokens.find(
      token => token.symbol === this.state.sellUnit
    );
    if (!token) {
      return;
    }
    const contractAddress = token.address;
    const address = await this.props.wallet.getAddress();
    const method =
      '0x' + sha3('allowance(address, address)').toString('hex').slice(0, 8);
    const owner = setLengthLeft(toBuffer(address), 32).toString('hex');
    const spender = setLengthLeft(
      toBuffer(loopringContractAddressMap.ETH),
      32
    ).toString('hex');
    const allowance = (await this.props.nodeLib.getAllowance({
      to: contractAddress,
      data: method + owner + spender
    })).toString();

    if (allowance < this.state.sellAmount) {
      this.props.showNotification(
        'warning',
        'insufficient token allowance',
        1000
      );
    }
  };

  onLoopringTxFeeChange = (value: string) => {
    if (Number(value) === 0) {
      this.setState({ loopringTxFee: value, savingShare: '100' });
      return;
    }

    if (Number(value) > 0 && isFinite(Number(value))) {
      this.setState({ loopringTxFee: value });
      return;
    }

    this.props.showNotification('warning', 'illegal input data', 1000);
  };

  onSaveShareChange = (value: string) => {
    const { loopringTxFee } = this.state;

    if (Number(loopringTxFee) > 0) {
      if (Number(value) > 100) {
        this.props.showNotification(
          'warning',
          'should not be bigger than 100%',
          1000
        );
        return;
      }

      if (Number(value) >= 0 && isFinite(Number(value))) {
        this.setState({ savingShare: value });
        return;
      }
      this.props.showNotification('warning', 'illegal input data', 1000);
    } else {
      this.props.showNotification(
        'warning',
        'while loopring tx fee is Zero, the savesharing is set to 100% by default',
        1000
      );
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    balance: state.wallet.balance,
    tokenBalances: getTokenBalances(state),
    node: getNodeConfig(state),
    nodeLib: getNodeLib(state),
    network: getNetworkConfig(state),
    tokens: getTokens(state),
    gasPrice: toWei(new Big(getGasPriceGwei(state)), 'gwei')
  };
}

export default connect(mapStateToProps, { showNotification })(SendExchange);
