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
        if (this.isActive('landing') || this.isActive('login') || this.isActive('signup')) {
            header = <Hero />;
        } else {
            header = <Header />;
        }

        return (
            <div className="ascribe-prize-app">
                {header}
                <div className="wp">
                    <RouteHandler />
                </div>
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default PrizeApp;
