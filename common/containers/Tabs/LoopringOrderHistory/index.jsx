import { BaseWallet } from 'libs/wallet/base';
import { connect } from 'react-redux';
import { showNotification } from 'actions/notifications';
import React from 'react';
import { UnlockHeader } from 'components/ui';
import { OrderTable } from './components';
import type { TokenBalance } from 'selectors/wallet';
import { getTokenBalances } from 'selectors/wallet';
import { getTokens } from 'selectors/wallet';
import translate from 'translations';

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

export class LoopringOrderHistory extends React.Component {
  props: Props;

  render() {
    const { wallet } = this.props;
    const unlocked = !!wallet;
    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active">
            <UnlockHeader title={'NAV_ViewLoopringOrderHistory'} />
          </main>
        </div>

        <section className="col-sm-12">
          {unlocked && <OrderTable />}
        </section>
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
