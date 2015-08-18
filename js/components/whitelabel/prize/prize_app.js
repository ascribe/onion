'use strict';

import React from 'react';
import Router from 'react-router';
import Hero from './components/prize_hero';
import Header from '../../header';
import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

let RouteHandler = Router.RouteHandler;

let PrizeApp = React.createClass({
    mixins: [Router.State],

    render() {
        let header = null;
        if (this.isActive('landing') || this.isActive('login') || this.isActive('signup')) {
            header = <Hero />;
        } else {
            header = <Header showAddWork={false} />;
        }

        return (
            <div className="container ascribe-prize-app">
                {header}
                <div className="wp">
                    <RouteHandler />
                </div>
                <GlobalNotification />
                <div id="modal" className="container"></div>
                <Footer />
            </div>
        );
    }
});

export default PrizeApp;
