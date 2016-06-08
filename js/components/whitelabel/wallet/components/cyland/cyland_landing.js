'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import withContext from '../../../../context/with_context';
import { whitelabelShape } from '../../../../prop_types';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let CylandLanding = React.createClass({
    propTypes: {
        // Injected through HOCs
        whitelabel: whitelabelShape.isRequired,
    },

    render() {
        setDocumentTitle('CYLAND MediaArtLab');

        return (
            <div className="ascribe-form-wrapper cyland-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row" style={{border: '1px solid #CCC', padding: '2em'}}>
                            <img src={this.props.whitelabel.logo} height="115" />
                            <div style={{marginTop: '1em'}}>
                                {getLangText('Submissions to Cyland Archive are powered by') + ' '}
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

export default withContext(CylandLanding, 'whitelabel');
