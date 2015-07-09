'use strict';

import React from 'react';

import EditionActions from '../../actions/edition_actions';
import EditionStore from '../../stores/edition_store';

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
        let isEncoding = state.edition.digital_work.isEncoding;
        if (isEncoding !== undefined && isEncoding !== 100) {
            let timerId = window.setInterval(() => EditionActions.fetchOne(this.props.params.editionId), 10000);
            this.setState({timerId: timerId})
        }
    },

    componentDidMount() {
        EditionStore.listen(this.onChange);
        EditionActions.fetchOne(this.props.params.editionId);
    },

    componentWillUnmount() {
        // Every time we're leaving the edition detail page,
        // just reset the edition that is saved in the edition store
        // as it will otherwise display wrong/old data once the user loads
        // the edition detail a second time
        EditionActions.updateEdition({});
        window.clearInterval(this.state.timerId);
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
                // TODO translate?
                <p>Loading</p>
            );
        }
    }
});

export default EditionContainer;
