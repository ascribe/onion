'use strict';

import { alt, altWhitelabel, altUser, altThirdParty } from '../alt';

import EventActions from '../actions/event_actions';

import UserActions from '../actions/user_actions';
import UserSource from '../sources/user_source';


class UserStore {
    constructor() {
        this.currentUser = {};
        this.userMeta = {
            invalidateCache: false,
            err: null
        };

        this.bindActions(UserActions);
        this.registerAsync(UserSource);
    }

    onFetchCurrentUser(invalidateCache) {
        this.userMeta.invalidateCache = invalidateCache;

        if (!this.getInstance().isLoading()) {
            this.getInstance().lookupCurrentUser();
        }
    }

    onSuccessFetchCurrentUser({users: [user = {}]}) {
        this.userMeta.invalidateCache = false;
        this.userMeta.err = null;

        if (user.email && user.email !== this.currentUser.email) {
            EventActions.userDidAuthenticate(user);
        }

        this.currentUser = user;
    }

    onLogoutCurrentUser() {
        this.getInstance()
            .performLogoutCurrentUser()
            .then(() => {
                EventActions.userDidLogout();

                // Reset all stores back to their initial state
                alt.recycle();
                altWhitelabel.recycle();
                altUser.recycle();
                altThirdParty.recycle();
            });
    }

    onSuccessLogoutCurrentUser() {
        this.currentUser = {};
    }

    onErrorCurrentUser(err) {
        console.logGlobal(err);
        this.userMeta.err = err;
    }
}

export default altUser.createStore(UserStore, 'UserStore');
