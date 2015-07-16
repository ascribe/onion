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
        UserFetcher.fetchOne()
            .then((res) => {
                this.actions.updateCurrentUser(res.users[0]);
            })
            .catch((err) => {
                console.log(err);
                this.actions.updateCurrentUser({});
            });
    }
    logoutCurrentUser() {
        UserFetcher.logout()
            .then(() => {
                this.actions.deleteCurrentUser();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default alt.createActions(UserActions);
