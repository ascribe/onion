'use strict';

import React from 'react';
import classNames from 'classnames';

import EventActions from '../../../../actions/event_actions';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import Hero from './components/pr_hero';

import AppBase from '../../../app_base';
import AppRouteWrapper from '../../../app_route_wrapper';
import Footer from '../../../footer';
import Header from '../../../header';

import { getSubdomain } from '../../../../utils/general_utils';
import { getCookie } from '../../../../utils/fetch_api_utils';


let PRApp = React.createClass({
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

        let style = {};
        let header;
        if (currentUser && currentUser.email && history.isActive(`/pieces/${getCookie(currentUser.email)}`)) {
            header = (<Hero currentUser={currentUser} />);
            style = { paddingTop: '0 !important' };
        } else if (currentUser && (currentUser.is_admin || currentUser.is_jury || currentUser.is_judge)) {
            header = (
                <Header
                    currentUser={currentUser}
                    routes={routes}
                    whitelabel={whitelabel}
                />
            );
        } else {
            style = { paddingTop: '0 !important' };
        }

        return (
            <div
                style={style}
                className={classNames('ascribe-app', 'ascribe-prize-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
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

export default AppBase(PRApp);
