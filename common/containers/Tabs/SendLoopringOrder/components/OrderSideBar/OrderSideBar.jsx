import React from 'react';
import translate from 'translations';
import type { Token } from 'config/data';
import { message } from 'antd';
import OrderListTable from './OrderListTable';
import io from 'socket.io-client';

import './style.css';

type Props = {
  sellToken: Token,
  buyToken: Token
};

type State = {
  depth: number
};

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
    orderId: '买1',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '买2',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '买3',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '买4',
    price: 0.000166,
    amount: '10000'
  },
  {
    orderId: '买5',
    price: 0.000166,
    amount: '10000'
  }
];

export default class OrderSideBar extends React.Component {
  props: Props;
  state: State = {
    depth: 0.1
  };

  componentDidMount() {
    // const socket = io('http://localhost:8080');
    //
    // socket.on('connect', () => {
    //   console.log(socket.id);
    // });
    //
    // socket.on('loopringOrder', (data) => {
    //   this.setState({data:data})
    // });
  }

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
