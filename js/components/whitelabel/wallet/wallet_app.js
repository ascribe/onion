'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../../header';
import Footer from '../../footer';

import GlobalNotification from '../../global_notification';

import getRoutes from './wallet_routes';
import classNames from 'classnames';


let RouteHandler = Router.RouteHandler;


let WalletApp = React.createClass({
    mixins: [Router.State],

    render() {
        let subdomain = window.location.host.split('.')[0];
        let ROUTES = getRoutes(null, subdomain);
        let activeRoutes = this.getRoutes().map(elem => 'route--' + elem.name);

        let header = null;
        if ((this.isActive('landing') || this.isActive('login') || this.isActive('signup'))
            && (['ikonotv', 'cyland']).indexOf(subdomain) > -1) {
            header = (
                <div className="hero"/>);
        } else {
            header = <Header showAddWork={true} routes={ROUTES} />;
        }

        return (
            <div className={classNames('container', 'ascribe-wallet-app', 'client--' + subdomain, activeRoutes)}>
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
