// @flow
import React, { Component } from 'react';
import { MergedNode } from 'selectors/config';

type Props<T> = {
  node: MergedNode,
  onClick: (value: T) => void
};

export default class NodeItem<T: *> extends Component<
  void,
  Props<T>,
  State
  > {
  props: Props<T>;

  render() {
    return (
      <a onClick={this.onclick}>
        {this.props.node.nodeName} &nbsp;
        <small key="service">
          {this.props.node.network} {this.props.node.custom ? '(custom)' : ''}
        </small>
      </a>
    );
  }

  onclick = () => {
    return this.props.onClick(this.props.node.nodeName)
  }
}
