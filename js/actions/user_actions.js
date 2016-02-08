'use strict';

import { alt } from '../alt';


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

export default alt.createActions(UserActions);
