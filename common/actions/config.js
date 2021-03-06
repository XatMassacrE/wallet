// @flow
import type { NodeConfig } from 'config/data';

/*** Change Language ***/
export type ChangeLanguageAction = {
  type: 'CONFIG_LANGUAGE_CHANGE',
  value: string
};

export function changeLanguage(sign: string): ChangeLanguageAction {
  return {
    type: 'CONFIG_LANGUAGE_CHANGE',
    value: sign
  };
}

/*** Change Node ***/
export type ChangeNodeAction = {
  type: 'CONFIG_NODE_CHANGE',
  // FIXME $keyof?
  value: string
};

export function changeNode(value: string): ChangeNodeAction {
  return {
    type: 'CONFIG_NODE_CHANGE',
    value
  };
}

/*** Change gas price ***/
export type ChangeGasPriceAction = {
  type: 'CONFIG_GAS_PRICE',
  value: number
};

export function changeGasPrice(value: number): ChangeGasPriceAction {
  return {
    type: 'CONFIG_GAS_PRICE',
    value
  };
}

/*** Union Type ***/
export type ConfigAction =
  | ChangeNodeAction
  | ChangeLanguageAction
  | ChangeGasPriceAction;


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
