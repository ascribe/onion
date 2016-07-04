'use strict';

import UserActions from '../actions/user_actions';

import request from '../utils/request';


const UserSource = {
    lookupCurrentUser: {
        remote() {
            return request('user');
        },

        local(state) {
            return !Object.keys(state.currentUser).length ? state : {};
        },

        success: UserActions.successFetchCurrentUser,
        error: UserActions.errorCurrentUser,

        shouldFetch(state, invalidateCache) {
            return invalidateCache || !Object.keys(state.currentUser).length;
        }
    },

    performLogoutCurrentUser: {
        remote() {
            return request('users_logout');
        },

        success: UserActions.successLogoutCurrentUser,
        error: UserActions.errorCurrentUser
    }
};

export default UserSource;
