// @flow
import React from 'react';
import translate from 'translations';
import UnitDropdown from './UnitDropdown';

type Props = {
  value: string,
  unit: string,
  title: string,
  tokens: string[],
  allowance: string,
  onChange?: (value: string, unit: string) => void
};

export default class AllowanceAmountField extends React.Component {
  props: Props;

  render() {
    const { title, value, unit, allowance, onChange } = this.props;
    const isReadonly = !onChange;
    return (
      <div>
        <label>
          {translate(title)}
        </label>
        <div className="input-group col-sm-11">
          <input
            className={`form-control ${isFinite(Number(value)) &&
            Number(value) >= 0
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
        {!isReadonly &&
          <p>
            <span className="strong">
              {translate('Current_Allowance')} {allowance},
            </span>
            <a onClick={this.onSendEverything}>
              <span className="strong">
                {translate('Allow_Total')}
              </span>
            </a>
          </p>}
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
