'use strict';

import requests from '../utils/requests';
import ApiUrls from '../constants/api_urls';

import UserActions from '../actions/user_actions';


const UserSource = {
    fetchCurrentUser: {
        remote() {
            return requests.get('user');
        },

        local(state) {
            return state.currentUser && state.currentUser.email ? state : {};
        },
        success: UserActions.receiveCurrentUser,
        error: UserActions.currentUserFailed,
        shouldFetch(state) {
            return state.invalidateCache || state.currentUser && !state.currentUser.email;
        }
    },

    logoutCurrentUser: {
        remote() {
            return requests.get(ApiUrls.users_logout);
        },
        success: UserActions.deleteCurrentUser,
        error: UserActions.currentUserFailed
    }
};

export default UserSource;