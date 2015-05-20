import React from 'react';
import AltContainer from 'alt/AltContainer';
import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';


let Header = React.createClass({

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange)
        UserActions.fetchCurrentUser();
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <div>hello {this.state.currentUser.username}</div>
        )
    }
});

export default Header;
