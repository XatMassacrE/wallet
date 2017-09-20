import React from 'react';
import translate from 'translations';
import { Table, message, Modal } from 'antd';
import { LoopingOrder } from 'libs/LoopringOrder';
import Big from 'bignumber.js';
import { connect } from 'react-redux';
import type { Token } from 'config/data';

const confirm = Modal.confirm;

import './style.scss';
import 'antd/lib/message/style/index.css';

type Props = {
  orders: [LoopingOrder],
  tokens: Token[]
};

export default class OrderTable extends React.Component {
  state = {
    sortedInfo: null
  };

  props: Props;

  render() {
    const { orders } = this.props;
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: translate('Loorping_Order_Hash'),
        dataIndex: 'hash',
        key: 'hash',
        sorter: (a, b) => this.sortString(a.hash, b.hash),
        sortOrder: sortedInfo.columnKey === 'hash' && sortedInfo.order
      },
      {
        title: translate('outToken'),
        dataIndex: 'outToken',
        key: 'outToken',
        sorter: (a, b) =>
          this.sortString(
            this.getTokenSymbol(a.outToken),
            this.getTokenSymbol(b.outToken)
          ),
        render: text => this.getTokenSymbol(text),
        sortOrder: sortedInfo.columnKey === 'outToken' && sortedInfo.order
      },
      {
        title: translate('inToken'),
        dataIndex: 'inToken',
        key: 'inToken',
        sorter: (a, b) =>
          this.sortString(
            this.getTokenSymbol(a.inToken),
            this.getTokenSymbol(b.inToken)
          ),
        render: text => this.getTokenSymbol(text),
        sortOrder: sortedInfo.columnKey === 'inToken' && sortedInfo.order
      },
      {
        title: translate('outAmount'),
        dataIndex: 'outAmount',
        key: 'outAmount',
        sorter: (a, b) => a.outAmount - b.outAmount,
        sortOrder: sortedInfo.columnKey === 'outAmount' && sortedInfo.order
      },
      {
        title: translate('inAmount'),
        dataIndex: 'inAmount',
        key: 'inAmount',
        sorter: (a, b) => a.inAmount - b.inAmount,
        sortOrder: sortedInfo.columnKey === 'inAmount' && sortedInfo.order
      },
      {
        title: translate('expiration'),
        dataIndex: 'expiration',
        key: 'expiration',
        render: text => this.changeToTime(text),
        sorter: (a, b) => a.expiration - b.expiration,
        sortOrder: sortedInfo.columnKey === 'expiration' && sortedInfo.order
      },
      {
        title: translate('fee'),
        dataIndex: 'fee',
        key: 'fee',
        sorter: (a, b) => a.fee - b.fee,
        sortOrder: sortedInfo.columnKey === 'fee' && sortedInfo.order
      },
      {
        title: translate('savingShare'),
        dataIndex: 'savingShare',
        key: 'savingShare',
        sorter: (a, b) => a.savingShare - b.savingShare,
        sortOrder: sortedInfo.columnKey === 'savingShare' && sortedInfo.order
      },
      {
        title: translate('action'),
        dataIndex: 'action',
        render: record =>
          <span>
            <a href="javaScript:void(0)">
              <span onClick={() => this.showDetail(record)}>
                {translate('detail')}
              </span>
            </a>
            <span className="ant-divider" />
            <a href="javaScript:void(0)">
              <span onClick={() => this.cancelOrder(record)}>
                {translate('cancel')}
              </span>
            </a>
          </span>
      }
    ];

    return (
      <div>
        {orders
          ? <Table
              columns={columns}
              dataSource={orders}
              rowKey={record => record.hash}
              onChange={this.handleChange}
            />
          : <h3>
              There is not any Loopring order owned by the current address
            </h3>}
      </div>
    );
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      sortedInfo: sorter
    });
  };

  sortString = (a: string, b: string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  };

  cancelOrder = (order: LoopingOrder) => {
    confirm({
      title: translate('Confirm_Cancel'),
      content: translate('Cancel_Loopring_Order_Content'),
      onOk() {
        message.info(translate('Cancel_Success'));
      },
      onCancel() {}
    });
  };
  showDetail = (order: LoopingOrder) => {};

  changeToTime = (seconds: Big | number) => {
    const date = new Date(seconds * 1000);
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      ' ' +
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':' +
      (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    );
  };

  getTokenSymbol = (add: string) => {
    const token = this.props.tokens.find(token => token.address === add);
    if (!token) {
      return add;
    }
    return token.symbol;
  };
}
