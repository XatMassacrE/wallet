// @flow
import React, { Component } from 'react';
import Navigation from './components/Navigation';
import GasPriceDropdown from './components/GasPriceDropdown';
import AddNodeModal from './components/AddNodeModal';
import { Link } from 'react-router';
import { Dropdown } from 'components/ui';
import NodeDropdown from './components/NodeDropdown';
import { languages, NODES } from '../../config/data';
import { MergedNode } from 'selectors/config';
import * as actions from 'actions/config';
import { getNodes, convertToMap } from 'selectors/config'
import Remove from './components/Remove'
import NodeItem from './components/NodeItem'

import './index.scss';
import removeImage from 'assets/images/icon-node-remove.svg';
import type {NodeConfig} from "../../config/data";
import { isAlphaNumericSpace, isValidURL, isPositiveNumber } from 'libs/validators';

type Props = {
  location: {},
  languageSelection: string,
  nodeSelection: string,
  gasPriceGwei: number,

  changeLanguage: (sign: string) => any,
  changeNode: typeof actions.changeNode,
  //changeNode: (key: string) => any,
  changeGasPrice: (price: number) => any,

  nodes: MergedNode[],
  nodesMap: {},

  addCustomNode: typeof actions.addCustomNode,
  removeCustomNode: typeof actions.removeCustomNode
};

type State = {
  nodes: MergedNode[],
  showNodeAdd: boolean,
  nodeName: string,
  nodeUrl: string,
  nodePort: number,
  nodeVerified: boolean
}

export default class Header extends Component {
  props: Props
  state: State = {
    nodes: this.props.nodes,
    showNodeAdd: false,
    nodeName: "",
    nodeUrl: "",
    nodePort: '',
    nodeVerified: false
  };

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if(this.state.nodeName !== prevState.nodeName ||
      this.state.nodeUrl !== prevState.nodeUrl ||
      this.state.nodePort !== prevState.nodePort) {
      if(this.isValid()){
        this.setState({nodeVerified : true});
      } else {
        this.setState({nodeVerified : false});
      }
    }
  }

  render() {
    const { languageSelection, changeNode, nodeSelection } = this.props;
    const { nodeName, nodeUrl, nodePort, nodeVerified, nodeSelectionState } = this.state;
    const selectedLanguage =
      languages.find(l => l.sign === languageSelection) || languages[0];
    const nodesMap = convertToMap(this.props.nodes)
    const selectedNode = nodesMap[nodeSelection];

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

              <NodeDropdown
                ariaLabel={`change node. current node ${selectedNode.network} node by ${selectedNode.service}`}
                options={Object.keys(nodesMap)}
                formatTitle={o => this.drawNode(nodesMap[o])}
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
          nodeName={nodeName}
          nodeUrl={nodeUrl}
          nodePort={nodePort}
          onNameChange={this.nodeNameChange}
          onUrlChange={this.nodeUrlChange}
          onPortChange={this.nodePortChange}
          onSave={this.addCustomNode}
          onCancel={showNodeAdd => this.cancel(showNodeAdd)}
          verified={nodeVerified}
        />}

      </div>
    );
  }

  isValid() {
    return (
      isAlphaNumericSpace(this.state.nodeName) &&
      isValidURL(this.state.nodeUrl) &&
      isPositiveNumber(this.state.nodePort)
    );
  }

  drawNode = (node: MergedNode) => {
    if(node.custom){
      return [
        <NodeItem node={node} onClick={this.changeNode}/>,
        ' ',
        <Remove nodeName={node.nodeName} onClick={this.removeNodeFromLocal}/>
      ]
    } else {
      return [
        <NodeItem node={node} onClick={this.changeNode}/>
      ]
    }
  }

  removeNodeFromLocal = (nodeName: string) => {
    var nodes = convertToMap(this.props.nodes)
    this.props.removeCustomNode(nodeName)
    this.setState({ nodes: this.state.nodes.filter(node => node.nodeName !== nodeName)})
    var defaultNodes = this.props.nodes.map(function (item) {
      if(!item.custom) return item
    });
    this.changeNode(defaultNodes[0].nodeName)
  }

  showAddCustomNode = () => {
    this.setState({ showNodeAdd: true });
  }

  changeLanguage = (value: { sign: string }) => {
    this.props.changeLanguage(value.sign);
  }

  nodeNameChange = (value: string) => {
    this.setState({nodeName: value})
  }

  nodeUrlChange = (value: string) => {
    this.setState({nodeUrl: value})
  }

  nodePortChange = (value: string) => {
    this.setState({nodePort: value})
  }

  changeNode = (key) => {
    this.props.changeNode(key)
  }

  addCustomNode = (node: MergedNode) => {
    this.props.addCustomNode(node)
    this.setState({
      nodes: [...this.state.nodes, node],
      showNodeAdd: false
    });
    //change select node
    this.changeNode(node.nodeName);
  };

  cancel = (newState) => {
    this.setState({ showNodeAdd: newState });
  }
}
