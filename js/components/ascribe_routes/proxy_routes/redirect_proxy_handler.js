'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../../stores/user_store';
import UserActions from '../../../actions/user_actions';

import AppConstants from '../../../constants/application_constants';


const { object } = React.PropTypes;

export default function RedirectProxyHandler({to, when}) {
    return (Component) => {
        return React.createClass({
            propTypes: {
                location: object
            },

            mixins: [History],

            getInitialState() {
                return UserStore.getState();
            },

            componentDidMount() {
                UserStore.listen(this.onChange);
                UserActions.fetchCurrentUser();
            },

            componentDidUpdate() {
                this.redirectConditionally();
            },

            componentWillUnmount() {
                UserStore.unlisten(this.onChange);
            },

            redirectConditionally() {
                const { query } = this.props.location;
                const { redirectAuthenticated, redirect } = query;

                if(when === 'loggedIn' || when === 'loggedOut') {

                    let exprToValidate = when === 'loggedIn' ?
                                     this.state.currentUser && this.state.currentUser.email :
                                     this.state.currentUser && !this.state.currentUser.email;

                    if(!exprToValidate && when === 'loggedIn' && redirect) {

                        delete query.redirect;
                        window.setTimeout(() => this.history.pushState(null, '/' + redirect, query));

                    } else if(exprToValidate) {
                        window.setTimeout(() => this.history.pushState(null, to, query));
                    } else if(!exprToValidate && when === 'loggedOut' && redirectAuthenticated) {
                        /*
                        * redirectAuthenticated contains an arbirary path
                        * eg pieces/<id>, editions/<bitcoin_id>, collection, settings, ...
                        * hence transitionTo cannot be used directly
                        */
                        window.location = AppConstants.baseUrl + redirectAuthenticated;
                    }
                } else {
                    throw new Error('"loggedIn" and "loggedOut" are the only valid inputs for when');
                }
            },

            onChange(state) {
                this.setState(state);
            },

            render() {
                return (
                    <Component {...this.props}/>
                );
            }
        });
    };
}