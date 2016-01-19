'use strict';

import React from 'react';
import GlobalNotification from '../../../global_notification';

import Hero from './components/pr_hero';
import Header from '../../../header';

import EventActions from '../../../../actions/event_actions';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import { getSubdomain } from '../../../../utils/general_utils';
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
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();

        if (this.state.currentUser && this.state.currentUser.email) {
            EventActions.profileDidLoad.defer(this.state.currentUser);
        }
    },

    componentWillUpdate(nextProps, nextState) {
        const { currentUser: { email: curEmail } = {} } = this.state;
        const { currentUser: { email: nextEmail } = {} } = nextState;

        if (nextEmail && curEmail !== nextEmail) {
            EventActions.profileDidLoad.defer(nextState.currentUser);
        }
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { history, children, routes } = this.props;
        const { currentUser } = this.state;
        let style = {};
        let subdomain = getSubdomain();
        let header;


        if (currentUser && currentUser.email && history.isActive(`/pieces/${getCookie(currentUser.email)}`)) {
            header = <Hero currentUser={currentUser} />;
            style = { paddingTop: '0 !important' };
        } else if(currentUser && (currentUser.is_admin || currentUser.is_jury || currentUser.is_judge)) {
            header = <Header routes={routes} />;
        } else {
            style = { paddingTop: '0 !important' };
        }

        return (
            <div>
                {header}
                <div
                    style={style}
                    className={'container ascribe-prize-app client--' + subdomain}>
                    {children}
                    <GlobalNotification />
                    <div id="modal" className="container"></div>
                </div>
            </div>
        );
    }
});

export default PRApp;
