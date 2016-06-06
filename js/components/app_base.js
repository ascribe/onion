import React from 'react';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import GlobalNotification from './global_notification';
import { currentUserShape } from './prop_types';

import { mergeOptions } from '../utils/general_utils';


export default function AppBase(App) {
    return React.createClass({
        displayName: 'AppBase',

        propTypes: {
            children: React.PropTypes.element.isRequired,
            location: React.PropTypes.object.isRequired,
            routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
        },

        childContextTypes: {
            currentUser: currentUserShape
        },

        getInitialState() {
            return mergeOptions(
                UserStore.getState(),
                WhitelabelStore.getState()
            );
        },

        getChildContext() {
            const { currentUser } = this.state;

            return { currentUser };
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
            const { routes } = this.props;
            const { whitelabel } = this.state;

            // The second element of the routes prop given to us by react-router is always the
            // active second-level component object (ie. after App).
            const activeRoute = routes[1];

            return (
                <div>
                    <App
                        {...this.props}
                        activeRoute={activeRoute}
                        whitelabel={whitelabel} />
                    <GlobalNotification />
                    <div id="modal" className="container" />
                </div>
            );
        }
    });
}
