'use strict';

import { altUser } from '../alt';
import UserActions from '../actions/user_actions';

import UserSource from '../sources/user_source';


class UserStore {
    constructor() {
        this.currentUser = {};
        this.bindActions(UserActions);
        this.registerAsync(UserSource);
    }

    onFetchCurrentUser() {
        if(!this.getInstance().isLoading()) {
            this.getInstance().fetchUser();
        }
    }

    onReceiveCurrentUser({users: [user]}) {
        this.currentUser = user;
    }

    onDeleteCurrentUser() {
        this.currentUser = {};
    }
}

export default altUser.createStore(UserStore, 'UserStore');
