'use strict';

import React from 'react';
import classNames from 'classnames';

import AppBase from '../../app_base';
import AppRouteWrapper from '../../app_route_wrapper';
import Header from '../../header';

import { getSubdomain } from '../../../utils/general_utils';


let WalletApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        history: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        // Provided from AppBase
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object
    },

    render() {
        const { activeRoute, children, currentUser, history, routes, whitelabel } = this.props;
        const subdomain = getSubdomain();
        const path = activeRoute && activeRoute.path;
        const Footer = activeRoute && activeRoute.footer;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if ((!path || history.isActive('/login') || history.isActive('/signup') || history.isActive('/contract_notifications'))
            && (['cyland', 'ikonotv', 'lumenus', '23vivi', 'polline', 'artcity', 'demo']).includes(subdomain)) {
            header = (<div className="hero"/>);
        } else {
            header = (
                <Header
                    currentUser={currentUser}
                    routes={routes}
                    whitelabel={whitelabel} />
            );
        }

        // In react-router 1.0, Routes have no 'name' property anymore. To keep functionality however,
        // we split the path by the first occurring slash and take the first splitter.
        return (
            <div className={classNames('ascribe-app', 'ascribe-wallet-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
                {header}
                <AppRouteWrapper
                    currentUser={currentUser}
                    whitelabel={whitelabel}>
                    {/* Routes are injected here */}
                    {children}
                </AppRouteWrapper>
                {Footer ? <Footer /> : null}
            </div>
        );
    }
});

export default AppBase(WalletApp);
