import React, { Component } from 'react';
import WebSocket from 'ws/lib/WebSocket';
import io from 'socket.io-client';
import { message } from 'antd';

type State = {
  data: string
};

export default class Test extends Component {
  state: State = {
    data: '0'
  };

  componentDidMount() {
    // const socket = io('localhost:8080', {transports: ['websocket']});
    //
    // socket.on('news', (data) => {
    //   console.log(data);
    // });

    const webSocket = new WebSocket('ws://localhost:8080');

    webSocket.onopen = event => {
      console.log('建立连接');
    };

    webSocket.onmessage = event => {
      console.log('Message from server ', event.data);
      message.info(event.data);
      this.setState({ data: event.data });
    };
  }

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
