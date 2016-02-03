'use strict';

import React from 'react';
import classNames from 'classnames';
import { History } from 'react-router';

import GlobalNotification from './global_notification';

import AppConstants from '../constants/application_constants';


export default function AppBase(App) {
    return React.createClass({
        displayName: 'AppBase',

        propTypes: {
            children: React.PropTypes.element.isRequired,
            history: React.PropTypes.object.isRequired,
            location: React.PropTypes.object.isRequired,
            routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
        },

        mixins: [History],

        componentDidMount() {
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

        render() {
            const { routes } = this.props;

            // The second element of the routes prop given to us by react-router is always the
            // active second-level component object (ie. after App).
            const activeRoute = routes[1];

            return (
                <div>
                    <App
                        {...this.props}
                        activeRoute={activeRoute} />
                    <GlobalNotification />
                    <div id="modal" className="container" />
                </div>
            );
        }
    });
};
