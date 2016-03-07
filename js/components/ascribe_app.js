'use strict';

import React from 'react';

import AppBase from './app_base';
import AppRouteWrapper from './app_route_wrapper';
import Footer from './footer';
import Header from './header';


let AscribeApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        // Provided from AppBase
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object
    },

    render() {
        const { activeRoute, children, currentUser, routes, whitelabel } = this.props;
        const Footer = activeRoute && activeRoute.footer;

        return (
            <div className="ascribe-app ascribe-default-app">
                <Header
                    currentUser={currentUser}
                    routes={routes}
                    whitelabel={whitelabel} />
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

export default AppBase(AscribeApp);
