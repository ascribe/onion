import React from 'react';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import GlobalNotification from './global_notification';
import { currentUserShape, locationShape, whitelabelShape } from './prop_types';

import { safeMerge } from '../utils/general';


export default function AppBase(App) {
    return React.createClass({
        displayName: 'AppBase',

        propTypes: {
            children: React.PropTypes.element.isRequired,
            location: locationShape.isRequired,
            routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
        },

        childContextTypes: {
            currentUser: currentUserShape,
            location: locationShape,
            whitelabel: whitelabelShape
        },

        getInitialState() {
            return safeMerge(
                UserStore.getState(),
                WhitelabelStore.getState()
            );
        },

        getChildContext() {
            const { currentUser, whitelabel } = this.state;

            return {
                currentUser,
                whitelabel,
                location: this.props.location
            };
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

            // The second element of the routes prop given to us by react-router is always the
            // active second-level component object (ie. after App).
            const activeRoute = routes[1];

            return (
                <div>
                    <App
                        {...this.props}
                        activeRoute={activeRoute} />
                    <GlobalNotification />
                    <div id="modal" className="container" />
                </div>
            );
        }
    });
}
