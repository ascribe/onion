'use strict';

import React from 'react';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import Header from './header';
import Footer from './footer';
import GlobalNotification from './global_notification';

import { mergeOptions } from '../utils/general_utils';


let AscribeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelActions.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { children, routes } = this.props;
        const { currentUser, whitelabel } = this.state;

        // Add the current user and whitelabel settings to all child routes
        const childrenWithProps = React.Children.map(children, (child) => {
            return React.cloneElement(child, {
                currentUser,
                whitelabel
            });
        });

        return (
            <div className="container ascribe-default-app">
                <Header routes={routes} />
                <div className="ascribe-body">
                    {/* Routes are injected here */}
                    {childrenWithProps}
                </div>
                <Footer />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default AscribeApp;
