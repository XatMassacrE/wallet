import React, { Component } from 'react';
import translate, { getTranslators } from 'translations';
import { donationAddressMap } from 'config/data';
import logo from 'assets/images/logo-myetherwallet.svg';
import { bityReferralURL } from 'config/data';
import './index.scss';

export default class Footer extends Component {
  render() {
    const translators = getTranslators();
    return (
      <footer className="Footer" role="contentinfo" aria-label="footer">
        <div className="container">
          <section className="row">
            <section className="row">
              <div className="Footer-about col-sm-3">
                <p aria-hidden="true">
                  <a href="/">
                    <h5> Loopring Wallet</h5>
                  </a>
                </p>
                <p>
                  <span>
                    {translate('FOOTER_1')}
                  </span>
                  <span>
                    {translate('FOOTER_1b')}
                  </span>
                </p>
                <br />
              </div>

              <div className="Footer-links col-sm-3">
                <h5>
                  <i aria-hidden="true">🌎</i> On the Web
                </h5>
                <ul>
                  <li>
                    <a
                      aria-label="my ether wallet.com"
                      href="https://www.Loopring.org"
                      target="_blank"
                    >
                      www.Loopring.org
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="my ether wallet github"
                      href="https://github.com/Loopring/protocol"
                      target="_blank"
                    >
                      Github: Loopring Protocol
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="join our slack"
                      href="https://loopring.now.sh/"
                      target="_blank"
                    >
                      Join Our Slack
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="twitter"
                      href="https://twitter.com/loopringorg"
                      target="_blank"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                {/*<h5>*/}
                {/*<i aria-hidden="true">🙏</i> Support*/}
                {/*</h5>*/}
                {/*<ul>*/}
                {/*<li>*/}
                {/*<a*/}
                {/*aria-label="email support at myetherwallet.com"*/}
                {/*href="mailto:support@myetherwallet.com"*/}
                {/*target="_blank"*/}
                {/*>*/}
                {/*Email*/}
                {/*</a>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*<a*/}
                {/*aria-label="open a github issue"*/}
                {/*href="https://github.com/kvhnuke/etherwallet/issues"*/}
                {/*target="_blank"*/}
                {/*>*/}
                {/*Github Issue*/}
                {/*</a>*/}
                {/*</li>*/}
                {/*</ul>*/}
              </div>
            </section>
          </section>
        </div>
      </footer>
    );
  }
}
