import React from 'react';
import translate from 'translations';
import { Table } from 'antd';
import { LoopingOrder } from 'libs/LoopringOrder';

type State = {
  sortedInfo: {}
};

type Props = {
  orders: [LoopingOrder]
};

export default class OrderTable extends React.Component {
  props: Props;
  state: State = {
    sortedInfo: null
  };

  render() {
    const { orders } = this.props;
    const columns = [
      {
        title: translate('outToken'),
        dataIndex: 'outToken',
        key: 'outToken',
        sorter: (a, b) => a.outToken - b.outToken
      },
      {
        title: translate('inToken'),
        dataIndex: 'inToken',
        key: 'inToken',
        sorter: (a, b) => a.inToken - b.inToken
      },
      {
        title: translate('outAmount'),
        dataIndex: 'outAmount',
        key: 'outAmount',
        sorter: (a, b) => a.outAmount - b.outAmount
      },
      {
        title: translate('inAmount'),
        dataIndex: 'inAmount',
        key: 'inAmount',
        sorter: (a, b) => a.inAmount - b.inAmount
      },
      {
        title: translate('expiration'),
        dataIndex: 'expiration',
        key: 'expiration',
        sorter: (a, b) => a.expiration - b.expiration
      },
      {
        title: translate('fee'),
        dataIndex: 'fee',
        key: 'fee',
        sorter: (a, b) => a.fee - b.fee
      },
      {
        title: translate('savingShare'),
        dataIndex: 'savingShare',
        key: 'savingShare',
        sorter: (a, b) => a.savingShare - b.savingShare
      }
    ];

    return (
      <div>
        {orders
          ? <Table
              columns={columns}
              dataSource={orders}
              onChange={this.handleChange}
            />
          : <h3>
              There is not any Loopring order owned by the current address
            </h3>}
      </div>
    );
  }

  handleChange = (pagination, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  };
}
