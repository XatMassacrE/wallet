// @flow
import React from 'react';
import translate from 'translations';
import { isValidHex } from 'libs/validators';
import { donationAddressMap } from 'config/data';

export default class DataField extends React.Component {
  props: {
    hasPreValue: boolean,
    preValue: string,
    value: string,
    onChange?: (e: string) => void
  };
  state = {
    expanded: false
  };

  render() {
    const { hasPreValue, preValue, value } = this.props;
    const valid = isValidHex(value || '');

    return (
      <div className="row form-group">
        <div className="col-sm-11 clearfix">
          <section>
            <div className="form-group">
              <label>
                {translate('TRANS_data')}
              </label>
              {hasPreValue &&
                preValue &&
                <input
                  className={`form-control ${valid
                    ? 'is-valid'
                    : 'is-invalid'}`}
                  type="text"
                  value={preValue || ''}
                  disabled
                />}
              <input
                className={`form-control ${valid ? 'is-valid' : 'is-invalid'}`}
                type="text"
                value={value || ''}
                disabled
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

  expand = () => {
    this.setState({ expanded: true });
  };

  onChange = (e: SyntheticInputEvent) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };
}
