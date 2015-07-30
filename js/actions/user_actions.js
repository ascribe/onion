'use strict';

import alt from '../alt';
import UserFetcher from '../fetchers/user_fetcher';


class UserActions {
    constructor() {
        this.generateActions(
            'updateCurrentUser',
            'deleteCurrentUser'
        );
    }

    fetchCurrentUser() {
        return UserFetcher.fetchOne()
            .then((res) => {
                this.actions.updateCurrentUser(res.users[0]);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateCurrentUser({});
            });
    }
    logoutCurrentUser() {
        return UserFetcher.logout()
            .then(() => {
                this.actions.deleteCurrentUser();
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(UserActions);
