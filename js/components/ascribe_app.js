import React from 'react';

import AppBase from './app_base';
import AppRouteWrapper from './app_route_wrapper';
import Footer from './footer';
import Header from './header';


const AscribeApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        // Provided from AppBase
        whitelabel: React.PropTypes.object
    },

    render() {
        const { activeRoute, children, routes, whitelabel } = this.props;
        const showFooter = activeRoute && activeRoute.footer;

        return (
            <div className="ascribe-app ascribe-default-app">
                <Header
                    routes={routes}
                    whitelabel={whitelabel} />
                <AppRouteWrapper
                    whitelabel={whitelabel}>
                    {/* Routes are injected here */}
                    {children}
                </AppRouteWrapper>
                {showFooter ? <Footer /> : null}
            </div>
        );
    }
});

export default AppBase(AscribeApp);
