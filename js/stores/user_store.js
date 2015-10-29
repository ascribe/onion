'use strict';

import { altUser } from '../alt';
import UserActions from '../actions/user_actions';

import SessionPersistentStore from './session_persistent_store';

// import AscribeStorage from '../models/ascribe_storage';
// import { sessionStorageAvailable } from '../utils/feature_detection_utils';


class UserStore extends SessionPersistentStore {
    constructor() {
        super('UserStore');
        this.currentUser = {};
        this.bindActions(UserActions);
    }

    onUpdateCurrentUser(user) {
        this.setItem('currentUser', user);
    }
    onDeleteCurrentUser() {
        this.currentUser = {};
    }
}

export default altUser.createStore(UserStore, 'UserStore');
