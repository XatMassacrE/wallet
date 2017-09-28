// @flow
import React, { Component } from 'react';
import Navigation from './components/Navigation';
import GasPriceDropdown from './components/GasPriceDropdown';
import AddNodeModal from './components/AddNodeModal';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Dropdown } from 'components/ui';
import { languages, NODES } from '../../config/data';
import * as customNodesActions from 'actions/customNodes';

import './index.scss';
import type { NodeConfig } from '../../config/data';

type Props = {
  location: {},
  languageSelection: string,
  nodeSelection: string,
  gasPriceGwei: number,

  changeLanguage: (sign: string) => any,
  changeNode: (key: string) => any,
  changeGasPrice: (price: number) => any,

  addCustomNode: typeof customNodesActions.addCustomNode,
  removeCustomNode: typeof customNodesActions.removeCustomNode
};

type State = {
  showNodeAdd: boolean
};

export default class Header extends Component {
  props: Props;

  state: State = {
    showNodeAdd: false
  };

  render() {
    const { languageSelection, changeNode, nodeSelection } = this.props;
    const selectedLanguage =
      languages.find(l => l.sign === languageSelection) || languages[0];
    const selectedNode = NODES[nodeSelection];
    console.log('//////////' + nodeSelection);

    return (
      <div className="Header">
        <section className="Header-branding">
          <section className="Header-branding-inner container">
            <Link
              to={'/'}
              className="Header-branding-title"
              aria-label="Go to homepage"
            >
              <h5>Loopring Wallet</h5>
            </Link>
            <div className="Header-branding-title-tagline">
              <span style={{ maxWidth: '395px' }}>
                Open-Source & Client-Side Ether Wallet
              </span>

              <GasPriceDropdown
                value={this.props.gasPriceGwei}
                onChange={this.props.changeGasPrice}
              />

              <Dropdown
                ariaLabel={`change language. current language ${selectedLanguage.name}`}
                options={languages}
                formatTitle={o => o.name}
                value={selectedLanguage}
                extra={[
                  <li key={'separator'} role="separator" className="divider" />,
                  <li key={'disclaimer'}>
                    <a data-toggle="modal" data-target="#disclaimerModal">
                      Disclaimer
                    </a>
                  </li>
                ]}
                onChange={this.changeLanguage}
              />

              <Dropdown
                ariaLabel={`change node. current node ${selectedNode.network} node by ${selectedNode.service}`}
                options={Object.keys(NODES)}
                formatTitle={o => [
                  NODES[o].network,
                  ' ',
                  <small key="service">
                    ({NODES[o].service})
                  </small>
                ]}
                value={nodeSelection}
                extra={
                  <li>
                    <a onClick={this.showAddCustomNode}>Add Custom Node</a>
                  </li>
                }
                onChange={changeNode}
              />
            </div>
          </section>
        </section>

        <Navigation location={this.props.location} />

        {this.state.showNodeAdd &&
          <AddNodeModal
            onChange={this.changeNode}
            onSave={this.addCustomNode}
            onCancel={showNodeAdd => this.cancel(showNodeAdd)}
          />}
      </div>
    );
  }

  showAddCustomNode = () => {
    this.setState({ showNodeAdd: true });
  };

  changeLanguage = (value: { sign: string }) => {
    this.props.changeLanguage(value.sign);
  };

  changeNode(key) {
    this.props.changeNode(key);
  }

  addCustomNode = (node: NodeConfig) => {
    console.log('in index add custom node:' + node.nodeName);
    this.props.addCustomNode(node);
    this.setState({ showNodeAdd: false });
  };

  cancel(newState) {
    this.setState({ showNodeAdd: newState });
  }
}

connect((state, props) => ({}), customNodesActions)(Header);
