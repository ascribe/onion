'use strict';

import React from 'react';
import Router from 'react-router';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import { mergeOptions } from '../../../../../utils/general_utils';


let CylandLanding = React.createClass({

    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(
            UserStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
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
                        <div className="row">
                        <img src="https://s3.amazonaws.com/upload.uxpin/files/308247/312701/logo.gif" />
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    Existing ascribe user?
                                </div>
                                <ButtonLink to="login">
                                    Log in
                                </ButtonLink>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    Do you need an account?
                                </div>
                                <ButtonLink to="signup">
                                    Sign up
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
