import React from 'react';

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
        return {'user': UserStore.getState(),
                'edition': EditionStore.getState()}
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionActions.fetchOne(this.props.params.editionId);
        EditionStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        UserStore.listen(this.onChange);
    },

    componentDidUnmount() {
        EditionStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    render() {

        if('title' in this.state.edition) {
            return (
                <Edition edition={this.state.edition } currentUser={this.state.currentUser}></Edition>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }

        
    }
});

export default EditionContainer;
