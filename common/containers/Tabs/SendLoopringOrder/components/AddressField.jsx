// @flow
import React from 'react';
import { Identicon } from 'components/ui';
import { getEnsAddress } from 'selectors/ens';
import { connect } from 'react-redux';
import type { State } from 'reducers';
import { isValidENSorEtherAddress, isValidENSAddress } from 'libs/validators';
import { resolveEnsName } from 'actions/ens';
import translate from 'translations';

type PublicProps = {
  placeholder: string,
  value: string
};

export class AddressField extends React.Component {
  props: PublicProps & {
    ensAddress: ?string,
    resolveEnsName: typeof resolveEnsName
  };

  render() {
    const { value, ensAddress } = this.props;
    const isReadonly = true;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>
            {translate('Allow_addr')}:
          </label>
          <input
            className={`form-control ${isValidENSorEtherAddress(value)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="text"
            value={value}
            disabled={isReadonly}
          />
          {!!ensAddress &&
            <p className="ens-response">
              ↳
              <span className="mono">{ensAddress}</span>
            </p>}
        </div>
        <div className="col-xs-1 address-identicon-container">
          <Identicon address={ensAddress || value} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State, props: PublicProps) {
  return {
    ensAddress: getEnsAddress(state, props.value)
  };
}

export default connect(mapStateToProps, { resolveEnsName })(AddressField);
