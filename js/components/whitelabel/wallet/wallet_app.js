'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../../header';
import Footer from '../../footer';

import GlobalNotification from '../../global_notification';

import getRoutes from './wallet_routes';
import classNames from 'classnames';

import { getSubdomain } from '../../../utils/general_utils';


let RouteHandler = Router.RouteHandler;


let WalletApp = React.createClass({
    mixins: [Router.State],

    render() {
        let subdomain = getSubdomain();
        let ROUTES = getRoutes(null, subdomain);
        let activeRoutes = this.getRoutes().map(elem => 'route--' + elem.name);

        let header = null;
        if ((this.isActive('landing') || this.isActive('login') || this.isActive('signup') || this.isActive('contract_notifications'))
            && (['ikonotv']).indexOf(subdomain) > -1) {
            header = (
                <div className="hero"/>);
        } else {
            header = <Header showAddWork={true} routes={ROUTES} />;
        }

        return (
            <div className={classNames('ascribe-wallet-app', activeRoutes)}>
                <div className='container'>
                    {header}
                    <RouteHandler />
                    <GlobalNotification />
                    <div id="modal" className="container"></div>
                    <Footer />
                </div>
            </div>
        );
    }
});

export default WalletApp;
