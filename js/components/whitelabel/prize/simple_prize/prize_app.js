'use strict';

import React from 'react';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import WhitelabelActions from '../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../stores/whitelabel_store';

import Hero from './components/prize_hero';

import AppRouteWrapper from '../../../app_route_wrapper';
import Header from '../../../header';
import Footer from '../../../footer';
import GlobalNotification from '../../../global_notification';

import { getSubdomain, mergeOptions } from '../../../../utils/general_utils';


let PrizeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        history: React.PropTypes.object,
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelActions.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { history, routes, children } = this.props;
        const { currentUser, whitelabel } = this.state;
        const subdomain = getSubdomain();

        // The second element of routes is always the active component object, where we can
        // extract the path.
        let path = routes[1] ? routes[1].path : null;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if (!path || history.isActive('/login') || history.isActive('/signup')) {
            header = <Hero />;
        } else {
            header = <Header routes={routes}/>;
        }

        return (
            <div className={'container ascribe-prize-app client--' + subdomain}>
                {header}
                <AppRouteWrapper
                    currentUser={currentUser}
                    whitelabel={whitelabel}>
                    {/* Routes are injected here */}
                    {children}
                </AppRouteWrapper>
                <Footer />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default PrizeApp;
