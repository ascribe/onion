'use strict';

import React from 'react';
import Router from 'react-router';
import Hero from './components/hero';
import Header from '../../header';
// import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

let RouteHandler = Router.RouteHandler;


let PrizeApp = React.createClass({
    mixins: [Router.State],

    render() {
        let header = null;
        if (this.isActive('pieces')) {
            header = null;
        }

        return (
            <div className="wp">
                <Hero />
                {header}
                <RouteHandler />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default PrizeApp;
