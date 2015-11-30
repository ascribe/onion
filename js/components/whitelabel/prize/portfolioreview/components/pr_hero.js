'use strict';

import React from 'react';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';


const PRHero = React.createClass({
    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        const { currentUser } = this.state;

        return (
            <div className="piece--hero">
                <h2><Glyphicon glyph="ok" /> Congratulations {currentUser.email}!</h2>
                <h1>You have successfully submitted to Portfolio Review 2016</h1>
                <p>See below, your uploaded portfolio:</p>
            </div>
        );
    }
});

export default PRHero;