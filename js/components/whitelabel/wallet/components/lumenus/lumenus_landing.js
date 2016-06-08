'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import withContext from '../../../../context/with_context';
import { whitelabelShape } from '../../../../prop_types';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let LumenusLanding = React.createClass({
    propTypes: {
        // Injected through HOCs
        whitelabel: whitelabelShape.isRequired,
    },

    componentWillMount() {
        setDocumentTitle('Lumenus Marketplace');
    },

    render() {
        return (
            <div className="container ascribe-form-wrapper">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <div className="row" style={{border: '1px solid #CCC', padding: '2em'}}>
                            <img src={this.props.whitelabel.logo} height="150" />
                            <div style={{marginTop: '1em'}}>
                                {getLangText('Lumenus Marketplace is powered by') + ' '}
                                <span>
                                    <span className="icon-ascribe-logo"></span>
                                </span>
                            </div>
                        </div>
                        <div className="row" style={{border: '1px solid #CCC', borderTop: 'none', padding: '2em'}}>
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

export default withContext(LumenusLanding, 'whitelabel');
