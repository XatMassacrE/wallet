import React from 'react';
import translate from 'translations';
import './style.css';

type Props = {
  value: string,
  onChange: (value: string) => void
};

export default class LoopringTxFee extends React.Component {
  props: Props;

  render() {
    const { value } = this.props;

    return (
      <div>
        <label>
          {translate('tx_fee')}
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
            onChange={this.onValueChange}
          />
          <div className="input-group-btn">
            <span className="btn btn-default unit ">
              <strong>LRC</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  onValueChange = (e: SyntheticInputEvent) => {
    this.props.onChange(e.target.value);
  };
}
