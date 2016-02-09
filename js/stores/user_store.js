'use strict';

import { alt, altUser, altThirdParty } from '../alt';

import EventActions from '../actions/event_actions';

import UserActions from '../actions/user_actions';
import UserSource from '../sources/user_source';


class UserStore {
    constructor() {
        this.currentUser = {};
        this.userMeta = {
            hasLoaded: false,
            err: null
        };

        this.bindActions(UserActions);
        this.registerAsync(UserSource);
        this.exportPublicMethods({
            hasLoaded: this.hasLoaded.bind(this)
        });
    }

    onFetchCurrentUser(invalidateCache) {
        if (invalidateCache || !this.getInstance().isLoading()) {
            this.getInstance().lookupCurrentUser(invalidateCache);
        }

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessFetchCurrentUser({ users: [ user = {} ] = [] }) {
        this.userMeta.hasLoaded = true;
        this.userMeta.err = null;

        if (user.email && user.email !== this.currentUser.email) {
            EventActions.userDidAuthenticate(user);
        }

        this.currentUser = user;
    }

    onLogoutCurrentUser() {
        this.getInstance().performLogoutCurrentUser();

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessLogoutCurrentUser() {
        EventActions.userDidLogout();

        // Reset all stores back to their initial state
        // Don't recycle the whitelabel stores since they're not dependent on login
        alt.recycle();
        altUser.recycle();
        altThirdParty.recycle();

        // Since we've just logged out, we can set this store's
        // hasLoaded flag back to true as there is no current user.
        this.userMeta.hasLoaded = true;
    }

    onErrorCurrentUser(err) {
        console.logGlobal(err);
        this.userMeta.hasLoaded = true;
        this.userMeta.err = err;
    }

    hasLoaded() {
        return this.userMeta.hasLoaded;
    }
}

export default altUser.createStore(UserStore, 'UserStore');
