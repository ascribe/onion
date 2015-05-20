import alt from '../alt';
import UserFetcher from '../fetchers/user_fetcher';


class UserActions {
    constructor() {
        this.generateActions(
            'updateCurrentUser'
        );
    }

    fetchCurrentUser() {
        UserFetcher.fetchOne()
            .then((res) => {
                this.actions.updateCurrentUser(res['users'][0]);
            })
            .catch((err) => {
                console.log(err);           
            });
    }
};

export default alt.createActions(UserActions);
