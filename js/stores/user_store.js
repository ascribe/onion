'use strict';

import { altUser } from '../alt';
import UserActions from '../actions/user_actions';


class UserStore {
    constructor() {
        this.currentUser = {};
        this.bindActions(UserActions);
    }

    onUpdateCurrentUser(user) {
        this.currentUser = user;
    }
    onDeleteCurrentUser() {
        this.currentUser = {};
    }
}

export default altUser.createStore(UserStore, 'UserStore');
