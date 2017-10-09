// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, Header } from 'components';
import Notifications from './Notifications';
import * as actions from 'actions/config';
import { getNodes, convertToMap } from 'selectors/config'

class App extends Component {
  props: {
    // FIXME
    children: any,
    location: any,
    router: any,
    isMobile: boolean,

    languageSelection: string,
    nodeSelection: string,

    gasPriceGwei: number,

    changeLanguage: typeof actions.changeLanguage,
    changeNode: typeof actions.changeNode,
    changeGasPrice: typeof actions.changeGasPrice,
    handleWindowResize: () => void,

    nodes: [],
    nodesMap: {},
    addCustomNode: typeof actions.addCustomNode,
    removeCustomNode: typeof actions.removeCustomNode
  };

  render() {
    let {
      children,
      // APP
      nodeSelection,
      languageSelection,
      gasPriceGwei,

      nodes,
      nodesMap,
      changeLanguage,
      changeNode,
      changeGasPrice,
      addCustomNode,
      removeCustomNode
    } = this.props;

    let headerProps = {
      location,
      languageSelection,
      nodeSelection,
      gasPriceGwei,

      nodes,
      nodesMap,
      changeLanguage,
      changeNode,
      changeGasPrice,
      addCustomNode,
      removeCustomNode
    };

    return (
      <div className="page-layout">
        <main>
          <Header {...headerProps} />
          <div className="main-content">
            {React.cloneElement(children, { languageSelection })}
          </div>
          <Footer />
        </main>
        <Notifications />
      </div>
    );
  }
}

function mapStateToProps(state) {
  var nodes = getNodes(state)
  return {
    nodeSelection: state.config.nodeSelection,
    nodeToggle: state.config.nodeToggle,
    languageSelection: state.config.languageSelection,
    languageToggle: state.config.languageToggle,

    gasPriceGwei: state.config.gasPriceGwei,
    nodes: nodes,
    nodesMap: convertToMap(nodes)
  };
}

export default connect(mapStateToProps, actions)(App);
