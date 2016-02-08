'use strict';

import React from 'react';
import classNames from 'classnames';

import Hero from './components/prize_hero';

import AppBase from '../../../app_base';
import AppRouteWrapper from '../../../app_route_wrapper';
import Footer from '../../../footer';
import Header from '../../../header';

import { getSubdomain } from '../../../../utils/general_utils';


let PrizeApp = React.createClass({
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

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if (!path || history.isActive('/login') || history.isActive('/signup')) {
            header = (<Hero />);
        } else {
            header = (
                <Header
                    currentUser={currentUser}
                    routes={routes}
                    whitelabel={whitelabel} />
            );
        }

        return (
            <div className={classNames('ascribe-app', 'ascribe-prize-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
                {header}
                <AppRouteWrapper
                    currentUser={currentUser}
                    whitelabel={whitelabel}>
                    {/* Routes are injected here */}
                    {children}
                </AppRouteWrapper>
                <Footer activeRoute={activeRoute} />
            </div>
        );
    }
});

export default AppBase(PrizeApp);
