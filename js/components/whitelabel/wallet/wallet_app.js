'use strict';

import React from 'react';
import classNames from 'classnames';

import UserStore from '../../../stores/user_store';
import UserActions from '../../../actions/user_actions';

import WhitelabelActions from '../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../stores/whitelabel_store';

import AppRouteWrapper from '../../app_route_wrapper';
import Header from '../../header';
import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

import { getSubdomain, mergeOptions } from '../../../utils/general_utils';


let WalletApp = React.createClass({
    propTypes: {
        history: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
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
        const { children, history, routes } = this.props;
        const { currentUser, whitelabel } = this.state;
        const subdomain = getSubdomain();

        // The second element of routes is always the active component object, where we can
        // extract the path.
        let path = routes[1] ? routes[1].path : null;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if ((!path || history.isActive('/login') || history.isActive('/signup') || history.isActive('/contract_notifications'))
            && (['cyland', 'ikonotv', 'lumenus', '23vivi']).indexOf(subdomain) > -1) {
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
            <div className={classNames('ascribe-wallet-app', 'route--' + (path ? path.split('/')[0] : 'landing'))}>
                <div className='container'>
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
            </div>
        );
    }
});

export default WalletApp;
