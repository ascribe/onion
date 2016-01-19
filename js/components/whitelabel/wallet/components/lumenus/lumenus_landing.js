'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let LumenusLanding = React.createClass({

    getInitialState() {
        return mergeOptions(
            WhitelabelStore.getState()
        );
    },

    componentWillMount() {
        setDocumentTitle('Lumenus Marketplace');
    },

    componentDidMount() {
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <div className="container ascribe-form-wrapper">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <div className="row" style={{border: '1px solid #CCC', padding: '2em'}}>
                            <img src={this.state.whitelabel.logo} width="150px"/>
                            <div style={{marginTop: '1em'}}>
                                {getLangText('Artwork from the Lumenus Marketplace is powered by') + ' '}
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

export default LumenusLanding;
