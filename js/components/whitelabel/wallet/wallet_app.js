'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../../header';
import Footer from '../../footer';

import GlobalNotification from '../../global_notification';

import getRoutes from './wallet_routes';

let RouteHandler = Router.RouteHandler;

let WalletApp = React.createClass({
    mixins: [Router.State],

    render() {
        let subdomain = window.location.host.split('.')[0];
        let ROUTES = getRoutes(null, subdomain);

        let header = null;
        if ((this.isActive('landing') || this.isActive('login') || this.isActive('signup') || this.isActive('contract_notifications'))
            && (['ikonotv', 'cyland']).indexOf(subdomain) > -1) {
            header = (
                <div className="hero"/>);
        } else {
            header = <Header showAddWork={true} routes={ROUTES} />;
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
