import { BaseWallet } from 'libs/wallet/base';
import { connect } from 'react-redux';
import { showNotification } from 'actions/notifications';
import React from 'react';
import { UnlockHeader } from 'components/ui';
import { OrderTable } from './components/index';
import type { TokenBalance } from 'selectors/wallet';
import { getTokenBalances, getTokens } from 'selectors/wallet';
import type { State as AppState } from 'reducers';
import type { Token } from 'config/data';

type Props = {
  wallet: ?BaseWallet,
  tokens: Token[],
  tokenBalances: TokenBalance[],
  showNotification: (
    level: string,
    msg: string,
    duration?: number
  ) => ShowNotificationAction
};

const orders = [
  {
    hash: '0x416842fd70c60fabcbb6c69ec8472636f5bd38d976c24c18a17b973111325cc1',
    protocol: '0x1111',
    owner: '0xowner',
    outToken: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
    inToken: '0x4470bb87d77b963a013db939be332f927f2b992e',
    outAmount: 5,
    inAmount: 4,
    expiration: 1000000000,
    fee: 1,
    savingShare: '5%',
    v: 'v',
    r: 'r1',
    s: 's'
  },
  {
    hash: '0x87b2a6708354cf7c9ebf3b44652c2715ab26e7f879eb0b6fc0ac9197ac443e12',
    protocol: '0x2222',
    owner: '0xowner',
    outToken: '0x960b236A07cf122663c4303350609A66A7B288C0',
    inToken: '0xEF68e7C694F40c8202821eDF525dE3782458639f',
    outAmount: 3,
    inAmount: 2,
    expiration: 1000000000,
    fee: 1,
    savingShare: '5%',
    v: 'v',
    r: 'r2',
    s: 's'
  },
  {
    hash: '0x530d8409b6324b415d16cfb10f153f18e6d8910793f8ed13f4723967d0884f49',
    protocol: '0x3333',
    owner: '0xowner',
    outToken: '0xAc709FcB44a43c35F0DA4e3163b117A17F3770f5',
    inToken: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    outAmount: 8,
    inAmount: 7,
    expiration: 2000000000,
    fee: 1,
    savingShare: '5%',
    v: 'v',
    r: 'r3',
    s: 's'
  },
  {
    hash: '0x03c4e804086d231d949dce256ef2a3cf5e107f5683e49f09079d4a8ade5a5613',
    protocol: '0x4444',
    owner: '0xowner',
    outToken: '0x74C1E4b8caE59269ec1D85D3D4F324396048F4ac',
    inToken: '0x1e797Ce986C3CFF4472F7D38d5C4aba55DfEFE40',
    outAmount: 10,
    inAmount: 9,
    expiration: 3000000000,
    fee: 1,
    savingShare: '5%',
    v: 'v',
    r: 'r4',
    s: 's'
  }
];

export class LoopringOrderHistory extends React.Component {
  props: Props;

  render() {
    const { wallet, tokens } = this.props;
    const unlocked = !!wallet;
    return (
      <section className="container">
        <div className="tab-content">
          <main className="tab-pane active">
            <UnlockHeader title={'NAV_ViewLoopringOrderHistory'} />
            <article className="row">
              <section>
                {unlocked && <OrderTable orders={orders} tokens={tokens} />}
              </section>
            </article>
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    tokens: getTokens(state),
    tokenBalances: getTokenBalances(state)
  };
}

export default connect(mapStateToProps, { showNotification })(
  LoopringOrderHistory
);
