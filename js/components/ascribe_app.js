'use strict';

import React from 'react';

import Header from '../components/header';
import Footer from '../components/footer';
import GlobalNotification from './global_notification';


let AscribeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render() {
        let { children, routes } = this.props;

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
