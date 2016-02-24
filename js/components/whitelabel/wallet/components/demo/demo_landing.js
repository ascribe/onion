'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let DemoLanding = React.createClass({
    propTypes: {
        // Provided from WalletApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object.isRequired
    },

    componentWillMount() {
        setDocumentTitle('Demo Marketplace');
    },

    render() {
        return (
            <div className="container ascribe-form-wrapper demo-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row demo-landing--header">
                            <img className="demo-landing--header-logo" src={this.props.whitelabel.logo} />
                            <div>
                                {getLangText('Demo Art Marketplace is powered by') + ' '}
                                <span className="icon-ascribe-logo" />
                            </div>
                        </div>
                        <div className="row demo-landing--content">
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
                            <div className="col-xs-6">
                                <p>
                                    {getLangText('Do you need an account?')}
                                </p>
                                <LinkContainer to="/signup">
                                    <Button>
                                        {getLangText('Sign up')}
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

export default DemoLanding;
