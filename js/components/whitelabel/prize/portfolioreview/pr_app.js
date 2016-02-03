'use strict';

import React from 'react';
import classNames from 'classnames';

import EventActions from '../../../../actions/event_actions';

import UserStore from '../../../../stores/user_store';
import UserActions from '../../../../actions/user_actions';

import Hero from './components/pr_hero';

import AppBase from '../../../app_base';
import Footer from '../../../footer';
import Header from '../../../header';

import { getSubdomain } from '../../../../utils/general_utils';
import { getCookie } from '../../../../utils/fetch_api_utils';


let PRApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        history: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
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
        const { activeRoute, children, history, routes } = this.props;
        const { currentUser } = this.state;
        const subdomain = getSubdomain();
        const path = activeRoute && activeRoute.path;

        let style = {};
        let header;
        if (currentUser && currentUser.email && history.isActive(`/pieces/${getCookie(currentUser.email)}`)) {
            header = (<Hero currentUser={currentUser} />);
            style = { paddingTop: '0 !important' };
        } else if (currentUser && (currentUser.is_admin || currentUser.is_jury || currentUser.is_judge)) {
            header = (<Header routes={routes} />);
        } else {
            style = { paddingTop: '0 !important' };
        }

        return (
            <div
                style={style}
                className={classNames('ascribe-prize-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
                {header}
                <div className="container ascribe-body">
                    {/* Routes are injected here */}
                    {children}
                </div>
                <Footer activeRoute={activeRoute} />
            </div>
        );
    }
});

export default AppBase(PRApp);
