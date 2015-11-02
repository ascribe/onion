'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../../stores/user_store';
import UserActions from '../../../actions/user_actions';

import AppConstants from '../../../constants/application_constants';


const { object } = React.PropTypes;
const WHEN_ENUM = ['loggedIn', 'loggedOut'];

/**
 * Can be used in combination with `Route` as an intermediate Handler
 * between the actual component we want to display dependent on a certain state
 * that is required to display that component.
 *
 * @param {string} options.to   Any type of route path that is defined in routes.js
 * @param {enum/string} options.when ('loggedIn' || 'loggedOut')
 */
export default function AuthProxyHandler({to, when}) {

    // validate `when`, must be contained in `WHEN_ENUM`.
    // Throw an error otherwise.
    if(WHEN_ENUM.indexOf(when) === -1) {
        let whenValues = WHEN_ENUM.join(', ');
        throw new Error(`"when" must be one of: [${whenValues}] got "${when}" instead`);
    }

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
                // Only refresh this component, when UserSources are not loading
                // data from the server
                if(!UserStore.isLoading()) {
                    this.redirectConditionally();
                }
            },

            componentWillUnmount() {
                UserStore.unlisten(this.onChange);
            },

            redirectConditionally() {
                const { query } = this.props.location;
                const { redirectAuthenticated, redirect } = query;

                // The user of this handler specifies with `when`, what kind of status
                // needs to be checked to conditionally do - if that state is `true` -
                // a redirect.
                //
                // So if when === 'loggedIn', we're checking if the user is logged in (and
                // vice versa)
                let exprToValidate = when === 'loggedIn' ?
                    this.state.currentUser && this.state.currentUser.email :
                    this.state.currentUser && !this.state.currentUser.email;

                // and redirect if `true`.
                if(exprToValidate) {
                    window.setTimeout(() => this.history.replaceState(null, to, query));

                    // Otherwise there can also be the case that the backend
                    // wants to redirect the user to a specific route when the user is logged out already
                } else if(!exprToValidate && when === 'loggedIn' && redirect) {

                    delete query.redirect;
                    window.setTimeout(() => this.history.replaceState(null, '/' + redirect, query));

                } else if(!exprToValidate && when === 'loggedOut' && redirectAuthenticated) {
                    /*
                     * redirectAuthenticated contains an arbirary path
                     * eg pieces/<id>, editions/<bitcoin_id>, collection, settings, ...
                     * hence transitionTo cannot be used directly.
                     *
                     * While we're getting rid of `query.redirect` explicitly in the
                     * above `else if` statement, here it's sufficient to just call
                     * `baseUrl` + `redirectAuthenticated`, as it gets rid of queries as well.
                     */
                    window.location = AppConstants.baseUrl + redirectAuthenticated;
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
