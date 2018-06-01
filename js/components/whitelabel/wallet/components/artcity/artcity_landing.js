'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let ArtcityLanding = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object.isRequired
    },

    componentWillMount() {
        setDocumentTitle('Artcity Marketplace');
    },

    render() {
        return (
            <div className="container ascribe-form-wrapper artcity-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row artcity-landing--header">
                            <img className="artcity-landing--header-logo" src={this.props.whitelabel.logo} />
                            <div>
                                {getLangText('Artcity Marketplace is powered by') + ' '}
                                <span className="icon-ascribe-logo" />
                            </div>
                        </div>
                        <div className="row artcity-landing--content">
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

export default ArtcityLanding;
