'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../../stores/user_store';
import UserActions from '../../../actions/user_actions';

import AppConstants from '../../../constants/application_constants';


const { object } = React.PropTypes;

/**
 * Can be used in combination with `ProxyRoute` as an intermediate Handler
 * between the actual component we want to display dependent on a certain state
 * that is required to display that component.
 *
 * @param {string} options.to   Any type of route path that is defined in routes.js
 * @param {enum/string} options.when ('loggedIn' || 'loggedOut')
 */
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

                // validate when as an enum, that is either 'loggedIn' or 'loggedOut'.
                // Otherwise throw an error.
                if(when === 'loggedIn' || when === 'loggedOut') {

                    // The user of this Handler specifies with `when`, what kind of status
                    // needs to be checked to conditionally do - if that state is `true` -
                    // a redirect.
                    //
                    // So if when === 'loggedIn', we're checking if the user is logged in and
                    // vice versa.
                    let exprToValidate = when === 'loggedIn' ?
                                     this.state.currentUser && this.state.currentUser.email :
                                     this.state.currentUser && !this.state.currentUser.email;

                    // and redirect if `true`.
                    if(exprToValidate) {
                        window.setTimeout(() => this.history.pushState(null, to, query));

                    // Otherwise there can also be the case that the backend
                    // wants to redirect the user to a specific case when he's logged out already
                    } else if(!exprToValidate && when === 'loggedIn' && redirect) {

                        delete query.redirect;
                        window.setTimeout(() => this.history.pushState(null, '/' + redirect, query));

                    // and when he's logged in already
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