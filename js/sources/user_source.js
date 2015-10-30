'use strict';

import requests from '../utils/requests';
import UserActions from '../actions/user_actions';


const UserSource = {
    fetchUser: {
        remote() {
            return requests.get('user');
        },

        local(state) {
            return state.currentUser && state.currentUser.email ? state.currentUser : {};
        },

        success: UserActions.receiveCurrentUser,

        shouldFetch(state) {
            return state.currentUser && !state.currentUser.email;
        }
    }
};

export default UserSource;