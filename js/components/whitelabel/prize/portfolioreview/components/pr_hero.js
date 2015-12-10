'use strict';

import React from 'react';
import { Link } from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import { getLangText } from '../../../../../utils/lang_utils';


const PRHero = React.createClass({
    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser.defer();
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
                <h2><Glyphicon glyph="ok" />
                    &nbsp;{getLangText('Congratulations') + (currentUser.email ? ` ${currentUser.email}!` : '!')}
                </h2>
                <h1>{getLangText('You have successfully submitted to Portfolio Review 2016.')}</h1>
                <p>Not you? <Link to="/logout">{getLangText('Change account.')}</Link></p>
            </div>
        );
    }
});

export default PRHero;
