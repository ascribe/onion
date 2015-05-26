import React from 'react';

import EditionActions from '../actions/edition_actions';
import EditionStore from '../stores/edition_store';

import Edition from './edition';

/**
 * This is the component that implements resource/data specific functionality
 */
let EditionContainer = React.createClass({

    getInitialState() {
        return EditionStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionActions.fetchOne(this.props.params.editionId);
        EditionStore.listen(this.onChange);
    },

    componentDidUnmount() {
        EditionStore.unlisten(this.onChange);
    },

    render() {

        if('title' in this.state.edition) {
            return (
                <Edition edition={this.state.edition}></Edition>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }

        
    }
});

export default EditionContainer;
