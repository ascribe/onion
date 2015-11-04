'use strict';

import requests from '../utils/requests';
import ApiUrls from '../constants/api_urls';

import UserActions from '../actions/user_actions';


const UserSource = {
    lookupCurrentUser: {
        remote() {
            return requests.get('user');
        },

        local(state) {
            return state.currentUser && state.currentUser.email ? state : {};
        },
        success: UserActions.successFetchCurrentUser,
        error: UserActions.currentUserFailed,
        shouldFetch(state) {
            return state.userMeta.invalidateCache || state.currentUser && !state.currentUser.email;
        }
    },

    performLogoutCurrentUser: {
        remote() {
            return requests.get(ApiUrls.users_logout);
        },
        success: UserActions.successLogoutCurrentUser,
        error: UserActions.currentUserFailed
    }
};

export default UserSource;