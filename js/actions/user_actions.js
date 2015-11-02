'use strict';

import { altUser } from '../alt';


class UserActions {
    constructor() {
        this.generateActions(
            'fetchCurrentUser',
            'receiveCurrentUser',
            'logoutCurrentUser',
            'deleteCurrentUser',
            'currentUserFailed'
        );
    }
}

export default altUser.createActions(UserActions);
