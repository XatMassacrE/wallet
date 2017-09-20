import React from 'react';
import { LoopingOrder } from 'libs/LoopringOrder';
import map from 'lodash/map';

export type order = {
  orderId: string,
  price: number,
  amount: string
};

type Props = {
  sellOrders: order[],
  buyOrders: order[]
};

export default class OrderListTable extends React.Component {
  props: Props;

  render() {
    const { sellOrders, buyOrders } = this.props;

    return (
      <ul className="orderlist fontsize-16">
        <li className="borderbtm black ">
          <span className="c1  gray">买卖</span>
          <span className="c2 ">价格</span>
          <span className="c3 ">数量</span>
        </li>

        {sellOrders.map(order =>
          <li className="red nonheader">
            <span className="orderc1">
              {order.orderId}
            </span>
            <span className="orderc2">
              {order.price}
            </span>
            <span className="orderc3">
              {order.amount}
            </span>
          </li>
        )}
        <hr />
        {buyOrders.map(order =>
          <li className="green nonheader">
            <span className="orderc1">
              {order.orderId}
            </span>
            <span className="orderc2">
              {order.price}
            </span>
            <span className="orderc3">
              {order.amount}
            </span>
          </li>
        )}
      </ul>
    );
  }
}
