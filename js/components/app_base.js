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
            history: React.PropTypes.object.isRequired,
            location: React.PropTypes.object.isRequired,
            routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

            children: React.PropTypes.oneOfType([
                React.PropTypes.arrayOf(React.PropTypes.element),
                React.PropTypes.element
            ])
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
            return (
                <div>
                    <App {...this.props} />
                    <Footer />
                    <GlobalNotification />
                    <div id="modal" className="container" />
                </div>
            );
        }
    });
};
