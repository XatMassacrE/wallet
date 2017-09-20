import React from 'react';
import translate from 'translations';
import type { Token } from 'config/data';
import { message } from 'antd';
import OrderListTable from './OrderListTable';

import './style.css';

type Props = {
  sellToken: Token,
  buyToken: Token
};

type State = {
  depth: number
};

const columns = [
  {
    title: '订单',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount'
  }
];

const sellOrders = [
  {
    orderId: '卖5',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖4',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖3',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖2',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖1',
    price: 0.000166,
    amount: '10000'
  }
];

const buyOrders = [
  {
    orderId: '卖1',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖2',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖3',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖4',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '卖5',
    price: 0.000166,
    amount: '10000'
  }
];

export default class OrderSideBar extends React.Component {
  props: Props;
  state: State = {
    depth: 0.1
  };

  render() {
    return (
      <div className="clearfix">
        <h5>订单列表</h5>
        <br />
        <OrderListTable sellOrders={sellOrders} buyOrders={buyOrders} />
        <br />
        深度选择：<a onClick={this.changeDepth.bind(null, 0.1)}>0.1</a>
        <span className="ant-divider" />
        <a onClick={this.changeDepth.bind(null, 0.01)}>0.01</a>
        <span className="ant-divider" />
        <a onClick={this.changeDepth.bind(null, 0.001)}>0.001</a>
      </div>
    );
  }

  changeDepth = (value: number) => {
    message.info(value);
    this.setState({ depth: value });
  };
}
