import alt from '../alt';
import UserAction from '../actions/user_actions';


class UserStore{
    constructor() {
        this.currentUser = {}
        this.bindActions(UserAction);
    }

    onUpdateCurrentUser(user) {
        this.currentUser = user;
    }
};

export default alt.createStore(UserStore);
