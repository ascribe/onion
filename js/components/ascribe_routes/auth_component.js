'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';


export function AuthComponent(Component) {
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
            if(this.state.currentUser && !this.state.currentUser.email) {
                this.history.pushState(null, '/login');
            }
        },

        componentWillUnmount() {
            UserStore.unlisten(this.onChange);
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
}