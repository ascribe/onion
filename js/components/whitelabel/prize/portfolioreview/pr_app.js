'use strict';

import React from 'react';

import EventActions from '../../../../actions/event_actions';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import WhitelabelActions from '../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../stores/whitelabel_store';

import AppRouteWrapper from '../../../app_route_wrapper';
import Hero from './components/pr_hero';
import Header from '../../../header';
import GlobalNotification from '../../../global_notification';

import { getSubdomain, mergeOptions } from '../../../../utils/general_utils';
import { getCookie } from '../../../../utils/fetch_api_utils';


let PRApp = React.createClass({
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
        const { children, currentUser, history, routes, whitelabel } = this.props;
        const subdomain = getSubdomain();

        // Add the current user and whitelabel settings to all child routes
        const childrenWithProps = React.Children.map(children, (child) => {
            return React.cloneElement(child, {
                currentUser,
                whitelabel
            });
        });

        let style = {};
        let header;
        if (currentUser && currentUser.email && history.isActive(`/pieces/${getCookie(currentUser.email)}`)) {
            header = (<Hero currentUser={currentUser} />);
            style = { paddingTop: '0 !important' };
        } else if(currentUser && (currentUser.is_admin || currentUser.is_jury || currentUser.is_judge)) {
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
            <div>
                {header}
                <div
                    style={style}
                    className={'container ascribe-prize-app client--' + subdomain}>
                    <AppRouteWrapper
                        currentUser={currentUser}
                        whitelabel={whitelabel}>
                        {/* Routes are injected here */}
                        {children}
                    </AppRouteWrapper>
                    <GlobalNotification />
                    <div id="modal" className="container"></div>
                </div>
            </div>
        );
    }
});

export default PRApp;
