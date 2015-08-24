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
        let subdomain = window.location.host.split('.')[0];
        if ((this.isActive('landing') || this.isActive('login') || this.isActive('signup'))
            && (['ikonotv', 'cyland']).indexOf(subdomain) > -1) {
            header = (
                <div className="hero"/>);
        } else {
            header = <Header showAddWork={true} />;
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
