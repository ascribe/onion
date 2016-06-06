'use strict';

import React from 'react';
import classNames from 'classnames';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import GlobalNotification from './global_notification';

import AppConstants from '../constants/application_constants';

import { mergeOptions } from '../utils/general_utils';


export default function AppBase(App) {
    return React.createClass({
        displayName: 'AppBase',

        propTypes: {
            children: React.PropTypes.element.isRequired,
            //FIXME: test if this is actually passed down now
            history: React.PropTypes.object.isRequired,
            location: React.PropTypes.object.isRequired,
            routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
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

            this.history.locationQueue.push(this.props.location);
        },

        componentWillReceiveProps(nextProps) {
            const { locationQueue } = this.history;
            locationQueue.unshift(nextProps.location);

            // Limit the number of locations to keep in memory to avoid too much memory usage
            if (locationQueue.length > AppConstants.locationThreshold) {
                locationQueue.length = AppConstants.locationThreshold;
            }
        },

        componentWillUnmount() {
            UserStore.unlisten(this.onChange);
            WhitelabelActions.unlisten(this.onChange);
        },

        onChange(state) {
            this.setState(state);
        },

        render() {
            const { routes } = this.props;
            const { currentUser, whitelabel } = this.state;

            // The second element of the routes prop given to us by react-router is always the
            // active second-level component object (ie. after App).
            const activeRoute = routes[1];

            return (
                <div>
                    <App
                        {...this.props}
                        activeRoute={activeRoute}
                        currentUser={currentUser}
                        whitelabel={whitelabel} />
                    <GlobalNotification />
                    <div id="modal" className="container" />
                </div>
            );
        }
    });
};
