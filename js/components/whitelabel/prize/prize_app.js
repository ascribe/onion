'use strict';

import React from 'react';
import Router from 'react-router';
import Hero from './components/prize_hero';
import Header from '../../header';
import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

import getRoutes from './prize_routes';

import { getSubdomain } from '../../../utils/general_utils';


let RouteHandler = Router.RouteHandler;

let PrizeApp = React.createClass({
    mixins: [Router.State],

    render() {
        let header = null;
        let subdomain = getSubdomain();

        let ROUTES = getRoutes(null, subdomain);

        if (this.isActive('landing') || this.isActive('login') || this.isActive('signup')) {
            header = <Hero />;
        } else {
            header = <Header showAddWork={false} routes={ROUTES}/>;
        }

        return (
            <div className={'container ascribe-prize-app client--' + subdomain}>
                {header}
                <RouteHandler />
                <GlobalNotification />
                <div id="modal" className="container"></div>
                <Footer />
            </div>
        );
    }
});

export default PrizeApp;
