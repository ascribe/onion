'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../../stores/user_store';
import UserActions from '../../../actions/user_actions';


export default function RedirectProxyHandler({to, when}) {
    return (Component) => {
        return React.createClass({
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
                if(when === 'loggedIn' || when === 'loggedOut') {

                    let exprToValidate = when === 'loggedIn' ?
                                     this.state.currentUser && this.state.currentUser.email :
                                     this.state.currentUser && !this.state.currentUser.email;
                    if(exprToValidate) {
                        window.setTimeout(() => this.history.pushState(null, to));
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