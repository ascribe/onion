'use strict';

import { altUser } from '../alt';
import UserFetcher from '../fetchers/user_fetcher';

import UserStore from '../stores/user_store';


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
                console.logGlobal(err);
                this.actions.updateCurrentUser({});
            });
    }

    /*fetchCurrentUser() {
        if(UserStore.getState().currentUser && !UserStore.getState().currentUser.email) {
            UserFetcher.fetchOne()
            .then((res) => {
                this.actions.updateCurrentUser(res.users[0]);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateCurrentUser({});
            });
        }
    }*/
    
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
