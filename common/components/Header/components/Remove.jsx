// @flow
import React, { Component } from 'react';
import removeImage from 'assets/images/icon-node-remove.svg';

type Props<T> = {
  nodeName: string,
  onClick: (value: T) => void
};

export default class Remove<T: *> extends Component<
  void,
  Props<T>,
  State
  > {
  props: Props<T>;

  render() {
    return (
      <a onClick={this.onclick}><img src={removeImage} title="Remove Custom Node" ></img></a>
    );
  }

  onclick = () => {
    return this.props.onClick(this.props.nodeName)
  }
}
