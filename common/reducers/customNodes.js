// @flow
import type {
  CustomNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction
} from 'actions/customNodes';
import type { NodeConfig } from 'config/data';

export type State = NodeConfig[];

export const INITIAL_STATE: State = [];

function addCustomNode(state: State, action: AddCustomNodeAction): State {
  if (state.find(node => node.nodeName === action.payload.nodeName)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomNode(state: State, action: RemoveCustomNodeAction): State {
  return state.filter(node => node.nodeName !== action.payload.nodeName);
}

export function customNodes(
  state: State = INITIAL_STATE,
  action: CustomNodeAction
): State {
  switch (action.type) {
    case 'CUSTOM_NODE_ADD':
      return addCustomNode(state, action);
    case 'CUSTOM_NODE_REMOVE':
      return removeCustomNode(state, action);
    default:
      return state;
  }
}
