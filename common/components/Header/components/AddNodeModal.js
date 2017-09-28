// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import translate from 'translations';
import type { NodeConfig } from '../../../config/data';

//import './AddNodeModal.scss';

type Props = {
  value: number,
  onChange: (key: string) => void,
  onSave: (node: NodeConfig) => void,
  onCancle: any
};

export default class AddNodeModal extends Component {
  state = { expanded: false };

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  constructor(props: Props) {
    super(props);
    this.updateNode = throttle(this.updateNode, 50);
  }

  render() {
    return (
      <article className="fade" id="customNodeModal">
        <section className="modal-dialog">
          <section className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" onClick={this.cancel}>
                &times;
              </button>

              <h2 className="modal-title text-info">
                {' '}{translate('NODE_Title')}{' '}
              </h2>

              <p className="small">
                <a
                  href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-can-i-connect-to-a-custom-node"
                  target="_blank"
                  rel="noopener"
                >
                  {' '}Instructions can be found here{' '}
                </a>
              </p>

              <div className="alert alert-danger small">
                {translate('NODE_Warning')}
              </div>

              <section className="row">
                <div className="clearfix col-xs-12">
                  <label>
                    {translate('NODE_Name')}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="My ETH Node"
                  />
                </div>

                <div className="clearfix col-xs-9">
                  <label>URL</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="http://127.0.0.1"
                  />
                </div>

                <div className="clearfix col-xs-3">
                  <label className="NODE_Port">Port</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="8545"
                  />
                </div>

                <div className="clearfix col-xs-12">
                  <label>
                    <input type="checkbox" value="false" /> HTTP Basic access
                    authentication{' '}
                  </label>
                </div>

                <div className="clearfix col-xs-6">
                  <label>User</label>
                  <input className="form-control" type="text" />
                </div>

                <div className="clearfix col-xs-6">
                  <label>Password</label>
                  <input className="form-control" type="password" />
                </div>

                <div className="clearfix col-xs-12 radio">
                  <label>
                    <input name="options" type="radio" value="eth" /> ETH{' '}
                  </label>
                  <label>
                    <input name="options" type="radio" value="etc" /> ETC{' '}
                  </label>
                  <label>
                    <input name="options" type="radio" value="rop" /> Ropsten{' '}
                  </label>
                  <label>
                    <input name="options" type="radio" value="kov" /> Kovan{' '}
                  </label>
                  <label>
                    <input name="options" type="radio" value="rin" /> Rinkeby{' '}
                  </label>
                  <label>
                    <input name="options" type="radio" value="cus" /> Custom{' '}
                  </label>
                  <label>
                    <input type="checkbox" value="true" /> Supports EIP-155{' '}
                  </label>
                </div>

                <div className="clearfix col-sm-6 col-sm-offset-6">
                  <label>Chain ID</label>
                  <input className="form-control" type="text" placeholder="" />
                </div>
              </section>
            </div>

            <div className="modal-footer">
              <button className="btn btn-default" onClick={this.cancel}>
                {translate('x_Cancel')}
              </button>
              <button className="btn btn-primary" onClick={this.saveCustomNode}>
                {translate('NODE_CTA')}
              </button>
            </div>
          </section>
        </section>
      </article>
    );
  }

  toggleExpanded = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  updateNode = (value: string) => {
    console.log('son: ' + value);
    this.props.onChange(value);
  };

  saveCustomNode = (e: SyntheticInputEvent) => {
    console.log('.......... add test node');
    // 添加node
    this.props.onSave({
      nodeName: 'nnnnn',
      network: 'a.com:8888',
      lib: {},
      service: '',
      estimateGas: false
    });

    //change select node
    //this.updateNode(e.target.value);
  };

  cancel = (e: SyntheticInputEvent) => {
    this.props.onCancel(false);
  };
}
