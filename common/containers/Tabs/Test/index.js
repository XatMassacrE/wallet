import React, { Component } from 'react';
import WebSocket from 'ws/lib/WebSocket';

import { message } from 'antd';

type State = {
  data: string
};

export default class Test extends Component {
  state: State = {
    data: '0'
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <label>Web Socket Test</label>
        <h2>
          {this.state.data}
        </h2>
      </div>
    );
  }
}
