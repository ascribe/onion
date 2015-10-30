'use strict';

import { altUser } from '../alt';
import UserActions from '../actions/user_actions';

import UserSource from '../sources/user_source';

// import AscribeStorage from '../models/ascribe_storage';
// import { sessionStorageAvailable } from '../utils/feature_detection_utils';


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
