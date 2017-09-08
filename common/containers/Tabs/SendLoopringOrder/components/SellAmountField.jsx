// @flow
import React from 'react';
import translate from 'translations';
import UnitDropdown from './UnitDropdown';

type Props = {
  value: string,
  unit: string,
  tokens: string[],
  toAllow: () => void,
  allowance: string,
  onChange?: (value: string, unit: string) => void
};

export default class SellAmountField extends React.Component {
  props: Props;

  render() {
    const { value, unit, allowance, onChange, toAllow } = this.props;
    const isReadonly = !onChange;

    return (
      <div>
        <label>
          {translate('Sell_amount')}
        </label>
        <div className="input-group col-sm-11">
          <input
            className={`form-control ${isFinite(Number(value)) &&
            Number(value) > 0
              ? 'is-valid'
              : 'is-invalid'}`}
            type="text"
            placeholder={translate('SEND_amount_short')}
            value={value}
            disabled={isReadonly}
            onChange={isReadonly ? void 0 : this.onValueChange}
          />
          <UnitDropdown
            value={unit}
            options={[].concat(this.props.tokens)}
            onChange={isReadonly ? void 0 : this.onUnitChange}
          />
        </div>
        <p>
          <span className="strong">
            {translate('Current_Allowance')} {allowance} ,
          </span>
          {Number(value) <= Number(allowance) &&
            <a onClick={this.onSendEverything}>
              <span className="strong">
                {translate('Sell_all')}
              </span>
            </a>}
          {Number(value) > Number(allowance) &&
            <a onClick={toAllow}>
              <span className="strong">
                {translate('To_allow')}
              </span>
            </a>}
        </p>
      </div>
    );
  }

  onUnitChange = (unit: string) => {
    if (this.props.onChange) {
      this.props.onChange(this.props.value, unit);
    }
  };

  onValueChange = (e: SyntheticInputEvent) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value, this.props.unit);
    }
  };

  onSendEverything = () => {
    if (this.props.onChange) {
      this.props.onChange('everything', this.props.unit);
    }
  };
}
