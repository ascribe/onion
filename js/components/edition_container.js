'use strict';

import React from 'react';

import { mergeOptions } from '../utils/general_utils';

import EditionActions from '../actions/edition_actions';
import EditionStore from '../stores/edition_store';
import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import Edition from './edition';

/**
 * This is the component that implements resource/data specific functionality
 */
let EditionContainer = React.createClass({
    getInitialState() {
        return mergeOptions(UserStore.getState(), EditionStore.getState());
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionStore.listen(this.onChange);
        UserStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        EditionActions.fetchOne(this.props.params.editionId);
    },

    componentWillUnmount() {
        EditionStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    deleteEdition() {
        // Delete Edition from server
    },

    loadEdition() {
        EditionActions.fetchOne(this.props.params.editionId);
    },

    render() {
        if('title' in this.state.edition) {
            return (
                <Edition
                    edition={this.state.edition}
                    currentUser={this.state.currentUser}
                    deleteEdition={this.deleteEdition}
                    loadEdition={this.loadEdition}/>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }
    }
});

export default EditionContainer;
