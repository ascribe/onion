'use strict';

import { altUser } from '../alt';
import UserActions from '../actions/user_actions';

import UserSource from '../sources/user_source';


class UserStore {
    constructor() {
        this.currentUser = {};
        this.invalidateCache = false;
        this.errorMessage = null;

        this.bindActions(UserActions);
        this.registerAsync(UserSource);
    }

    onFetchCurrentUser(invalidateCache) {
        this.invalidateCache = invalidateCache;

        if(!this.getInstance().isLoading()) {
            this.getInstance().fetchCurrentUser();
        }
    }

    onReceiveCurrentUser({users: [user]}) {
        this.invalidateCache = false;
        this.currentUser = user;
    }

    onDeleteCurrentUser() {
        this.currentUser = {};
    }

    onCurrentUserFailed(err) {
        console.logGlobal(err);
        this.errorMessage = err;
    }
}

export default altUser.createStore(UserStore, 'UserStore');
