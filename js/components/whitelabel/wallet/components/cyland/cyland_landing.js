'use strict';

import React from 'react';
import Router from 'react-router';


import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';

let CylandLanding = React.createClass({

    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        // if user is already logged in, redirect him to piece list
        if(this.state.currentUser && this.state.currentUser.email) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => this.replaceWith('pieces'), 0);
        }
    },

    render() {
        return (
            <div className="container ascribe-form-wrapper">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <div className="row" style={{border: '1px solid #CCC', padding: '2em'}}>
                            <img src={this.state.whitelabel.logo} width="400px"/>
                            <div style={{marginTop: '1em'}}>
                                {getLangText('Submissions to Cyland Archive are powered by')}
                                <span>
                                    <span> ascribe </span>
                                    <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                                </span>
                            </div>
                        </div>
                        <div className="row" style={{border: '1px solid #CCC', borderTop: 'none', padding: '2em'}}>
                            <div className="col-sm-6">
                                <p>
                                    {getLangText('Existing ascribe user?')}
                                </p>
                                <ButtonLink to="login">
                                    {getLangText('Log in')}
                                </ButtonLink>
                            </div>
                            <div className="col-sm-6">
                                <p>
                                    {getLangText('Do you need an account?')}
                                </p>
                                <ButtonLink to="signup">
                                    {getLangText('Sign up')}
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default CylandLanding;