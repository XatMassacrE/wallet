import React from 'react';
import { browserHistory, Redirect, Route } from 'react-router';
import { useBasename } from 'history';
import { App } from 'containers';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import ViewWallet from 'containers/Tabs/ViewWallet';
import Help from 'containers/Tabs/Help';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Contracts from 'containers/Tabs/Contracts';
import SendLoopringOrder from 'containers/Tabs/SendLoopringOrder';
import LoopringOrderHistory from 'containers/Tabs/LoopringOrderHistory';
import CandleStick from 'containers/Tabs/CandleStick';

export const history = getHistory();

export const Routing = () =>
  <Route name="App" path="" component={App}>
    <Route name="Candles" path="/" component={CandleStick} />
    <Route
      name="ViewWallet"
      path="/generate-wallet"
      component={GenerateWallet}
    />
    <Route name="GenerateWallet" path="/view-wallet" component={ViewWallet} />
    <Route name="Help" path="/help" component={Help} />
    <Route name="Send" path="/send-transaction" component={SendTransaction} />
    <Route name="Contracts" path="/contracts" component={Contracts} />
    <Route
      name="Exchange"
      path="/send-loopring-order"
      component={SendLoopringOrder}
    />
    <Route
      name="OrderHistory"
      path="/loopring-order-history"
      component={LoopringOrderHistory}
    />
    <Redirect from="/*" to="/" />
  </Route>;

function getHistory() {
  const basename = '';
  return useBasename(() => browserHistory)({ basename });
}
