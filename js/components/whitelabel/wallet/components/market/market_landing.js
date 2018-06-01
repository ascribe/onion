'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let MarketLanding = React.createClass({
    propTypes: {
        // Provided from WalletApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object.isRequired
    },

    componentDidUpdate() {
        const { name } = this.props.whitelabel;
 
        if (name) {
            setDocumentTitle(`${name} Marketplace`);
        }
    },

    render() {
        const { logo, name } = this.props.whitelabel;

        return (
            <div className="container ascribe-form-wrapper landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row landing--header">
                            <img className="landing--header-logo" src={logo} />
                            <div>
                                {getLangText(`${name} Marketplace is powered by`) + ' '}
                                <span className="icon-ascribe-logo" />
                            </div>
                        </div>
                        <div className="row landing--content">
                            <div className="col-xs-6">
                                <p>
                                    {getLangText('Existing ascribe user?')}
                                </p>
                                <LinkContainer to="/login">
                                    <Button>
                                        {getLangText('Log in')}
                                    </Button>
                                </LinkContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default MarketLanding;
