import React from 'react';
import translate from 'translations';

type Props = {
  value: string,
  onChange: (value: string) => void
};

export default class SaveSharing extends React.Component {
  props: Props;

  render() {
    const { value } = this.props;

    return (
      <div>
        <label>
          {translate('save_sharing')} (%)
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
        </div>
      </div>
    );
  }

  onValueChange = (e: SyntheticInputEvent) => {
    this.props.onChange(e.target.value);
  };
}
