'use strict';

import React from 'react';
import GlobalNotification from '../../../global_notification';

import Hero from './components/pr_hero';

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
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { history, children } = this.props;
        const { currentUser } = this.state;
        let subdomain = getSubdomain();
        let header;

        if (currentUser && currentUser.email && history.isActive(`/pieces/${getCookie(currentUser.email)}`)) {
            header = <Hero />;
        }

        return (
            <div>
                {header}
                <div className={'container ascribe-prize-app client--' + subdomain}>
                    {children}
                    <GlobalNotification />
                    <div id="modal" className="container"></div>
                </div>
            </div>
        );
    }
});

export default PRApp;
