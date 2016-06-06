'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let Vivi23Landing = React.createClass({
    propTypes: {
        customThumbnailPlaceholder: React.PropTypes.func,

        // Provided from WalletApp
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    componentWillMount() {
        setDocumentTitle('23VIVI Marketplace');
    },

    render() {
        return (
            <div className="ascribe-form-wrapper vivi23-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row vivi23-landing--header">
                            <img
                                className="vivi23-landing--header-logo"
                                src={this.props.whitelabel.logo}
                                height="75" />
                            <div>
                                {getLangText('23VIVI digital wallet is powered by') + ' '}
                                <span className="icon-ascribe-logo" />
                            </div>
                        </div>
                        <div className="row vivi23-landing--content">
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

export default Vivi23Landing;
