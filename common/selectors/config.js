// @flow
import type { State } from 'reducers';
import { BaseNode } from 'libs/nodes';
import { NODES, NETWORKS } from 'config/data';
import type { NetworkConfig, NetworkContract, NodeConfig } from 'config/data';

export function getNode(state: State): string {
  return state.config.nodeSelection;
}

export function getNodeLib(state: State): BaseNode {
  return NODES[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: State): NetworkConfig {
  return NETWORKS[NODES[state.config.nodeSelection].network];
}

export function getNetworkContracts(state: State): ?Array<NetworkContract> {
  return getNetworkConfig(state).contracts;
}

export function getGasPriceGwei(state: State): number {
  return state.config.gasPriceGwei;
}

export function getNodeConfig(state: State): NodeConfig {
  return NODES[state.config.nodeSelection];
}

type MergedNode = NodeConfig & {
  custom: boolean
};

export function getNodes(state: State): MergedNode[] {
  const nodes: MergedNode[] = [];
  for (var key in NODES) {
    var value = { ...NODES[key], custom: false, nodeName: key };
    nodes.push(value);
  }
  return nodes.concat(
    state.customNodes.map(node => ({ ...node, custom: true }))
  );
}
