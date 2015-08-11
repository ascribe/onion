'use strict';

import React from 'react';
import Router from 'react-router';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';


let Landing = React.createClass({

    mixins: [Router.Navigation],

    getInitialState() {
        return UserStore.getState();
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
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <h1>Sluice_screens ↄc Prize 2015</h1>
                        <p>
                            This is the submission page for Sluice_screens ↄc Prize 2015.
                        </p>
                        <ButtonGroup className="enter" bsSize="large" vertical>
                            <ButtonLink to="signup">
                                Sign up to submit
                            </ButtonLink>

                            <p>
                                or, already an ascribe user?
                            </p>
                            <ButtonLink to="login">
                                Log in to submit
                            </ButtonLink>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        );
    }
});

export default Landing;
