'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';

let Vivi23Landing = React.createClass({
    getInitialState() {
        return WhitelabelStore.getState();
    },

    componentWillMount() {
        setDocumentTitle('23VIVI Marketplace');
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
            <div className="container ascribe-form-wrapper vivi23-landing">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row vivi23-landing--header">
                            <img className="vivi23-landing--header-logo" src={this.state.whitelabel.logo} />
                            <div>
                                {getLangText('Artwork from the 23VIVI Marketplace is powered by') + ' '}
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
