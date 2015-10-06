'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

export function AuthComponent(Component) {
    return React.createClass({
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
        },

        render() {
            return (
                <Component {...this.props}/>
            );
        }
    });
}