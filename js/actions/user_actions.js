'use strict';

import { altUser } from '../alt';


class UserActions {
    constructor() {
        this.generateActions(
            'fetchCurrentUser',
            'successFetchCurrentUser',
            'logoutCurrentUser',
            'successLogoutCurrentUser',
            'currentUserFailed'
        );
    }
}

export default altUser.createActions(UserActions);
