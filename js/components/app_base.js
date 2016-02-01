'use strict';

import React from 'react';
import classNames from 'classnames';
import { History } from 'react-router';

import Footer from './footer';
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
            const { children } = this.props;

            // Get the currently active route of the app by using the injected route parameter
            // on the currently active child route.
            // Note that despite its name, this.props.children can only ever be a single
            // React.PropTypes.element.
            const activeRoute = children.props.route;

            return (
                <div>
                    <Footer />
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
