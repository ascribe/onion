'use strict';

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
        EditionStore.listen(this.onChange);
        EditionActions.fetchOne(this.props.params.editionId);
    },

    componentWillUnmount() {
        EditionStore.unlisten(this.onChange);
    },


    loadEdition() {
        EditionActions.fetchOne(this.props.params.editionId);
    },

    render() {
        if('title' in this.state.edition) {
            return (
                <Edition
                    edition={this.state.edition}
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
