'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../../header';
import Footer from '../../footer';

import GlobalNotification from '../../global_notification';

let RouteHandler = Router.RouteHandler;

let WalletApp = React.createClass({
    mixins: [Router.State],

    render() {
        let header = null;
        if (this.isActive('landing') || this.isActive('login') || this.isActive('signup')) {
            header = (
                <div className="hero"/>);
        } else {
            header = <Header showAddWork={false} />;
        }
        return (
            <div className="container ascribe-prize-app">
                {header}
                <RouteHandler />
                <GlobalNotification />
                <div id="modal" className="container"></div>
                <Footer />
            </div>
        );
    }
});

export default WalletApp;
