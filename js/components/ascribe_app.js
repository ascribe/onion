'use strict';

import React from 'react';
import { History } from 'react-router';

import Header from './header';
import Footer from './footer';
import GlobalNotification from './global_notification';

import AppConstants from '../constants/application_constants';


let AscribeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        routes: React.PropTypes.arrayOf(React.PropTypes.object),
        location: React.PropTypes.object
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
        const { children, routes } = this.props;

        return (
            <div className="container ascribe-default-app">
                <Header routes={routes} />
                {/* Routes are injected here */}
                <div className="ascribe-body">
                    {children}
                </div>
                <Footer />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default AscribeApp;
