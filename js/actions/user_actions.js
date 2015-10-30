'use strict';

import { altUser } from '../alt';
import UserFetcher from '../fetchers/user_fetcher';


class UserActions {
    constructor() {
        this.generateActions(
            'fetchCurrentUser',
            'receiveCurrentUser',
            'deleteCurrentUser'
        );
    }

    logoutCurrentUser() {
        UserFetcher.logout()
            .then(() => {
                this.actions.deleteCurrentUser();
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default altUser.createActions(UserActions);
