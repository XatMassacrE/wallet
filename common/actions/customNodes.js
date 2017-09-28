// @flow
import type { NodeConfig } from 'config/data';

/*** Add custom node ***/
export type AddCustomNodeAction = {
  type: 'CUSTOM_NODE_ADD',
  payload: NodeConfig
};

export function addCustomNode(payload: NodeConfig): AddCustomNodeAction {
  return {
    type: 'CUSTOM_NODE_ADD',
    payload
  };
}

/*** Remove Custom Node ***/
export type RemoveCustomNodeAction = {
  type: 'CUSTOM_NODE_REMOVE',
  payload: string
};

export function removeCustomNode(payload: string): RemoveCustomNodeAction {
  return {
    type: 'CUSTOM_NODE_REMOVE',
    payload
  };
}

/*** Union Type ***/
export type CustomNodeAction = AddCustomNodeAction | RemoveCustomNodeAction;
