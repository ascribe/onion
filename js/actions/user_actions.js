'use strict';

import { altUser } from '../alt';


class UserActions {
    constructor() {
        this.generateActions(
            'fetchCurrentUser',
            'successFetchCurrentUser',
            'logoutCurrentUser',
            'successLogoutCurrentUser',
            'errorCurrentUser'
        );
    }
}

export default altUser.createActions(UserActions);
