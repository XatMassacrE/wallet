// @flow
import type { State } from 'reducers';
import { BaseNode } from 'libs/nodes';
import { NODES, NETWORKS } from 'config/data';
import type { NetworkConfig, NetworkContract, NodeConfig } from 'config/data';

export function getNode(state: State): string {
  return state.config.nodeSelection;
}

export function getNodeLib(state: State): BaseNode {
  const nodes = convertToMap(getNodes(state))
  return nodes[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: State): NetworkConfig {
  const nodes = convertToMap(getNodes(state))
  return NETWORKS[nodes[state.config.nodeSelection].network];
}

export function getNetworkContracts(state: State): ?Array<NetworkContract> {
  return getNetworkConfig(state).contracts;
}

export function getGasPriceGwei(state: State): number {
  return state.config.gasPriceGwei;
}

export function getNodeConfig(state: State): NodeConfig {
  const nodes = convertToMap(getNodes(state))
  return nodes[state.config.nodeSelection];
}

export type MergedNode = NodeConfig & {
  custom: boolean
};

export function getNodes(state: State): MergedNode[] {
  const nodes: MergedNode[] = [];
  for(var key in NODES){
    var value = {...NODES[key], custom: false, nodeName: key};
    nodes.push(value)
  }
  return nodes.concat(
    state.customNodes.map(node => ({ ...node, custom: true }))
  );
}

export function convertToMap(nodes: []){
  var map = []
  for(var i=0;i<nodes.length;i++){
    var node = nodes[i];
    map[node.nodeName] = node
  }
  return map
}
