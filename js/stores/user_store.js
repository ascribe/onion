'use strict';

import { altUser } from '../alt';
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

        if(!this.getInstance().isLoading()) {
            this.getInstance().lookupCurrentUser();
        }
    }

    onSuccessFetchCurrentUser({users: [user]}) {
        this.userMeta.invalidateCache = false;
        this.userMeta.err = null;
        this.currentUser = user;
    }

    onLogoutCurrentUser() {
        this.getInstance().performLogoutCurrentUser();
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
