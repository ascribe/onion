'use strict';

import React from 'react';
import { History } from 'react-router';

import ReactError from '../../mixins/react_error';
import { ResourceNotFoundError } from '../../models/errors';

import EditionActions from '../../actions/edition_actions';
import EditionStore from '../../stores/edition_store';

import Edition from './edition';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';
import { setDocumentTitle } from '../../utils/dom_utils';


/**
 * This is the component that implements resource/data specific functionality
 */
let EditionContainer = React.createClass({
    propTypes: {
        params: React.PropTypes.object
    },

    mixins: [History, ReactError],

    getInitialState() {
        return EditionStore.getState();
    },

    componentDidMount() {
        EditionStore.listen(this.onChange);

        // Every time we're entering the edition detail page,
        // just reset the edition that is saved in the edition store
        // as it will otherwise display wrong/old data once the user loads
        // the edition detail a second time
        EditionActions.updateEdition({});
        this.loadEdition();
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces)
    componentWillReceiveProps(nextProps) {
        if(this.props.params.editionId !== nextProps.params.editionId) {
            EditionActions.updateEdition({});
            EditionActions.fetchOne(nextProps.params.editionId);
        }
    },

    componentDidUpdate() {
        const { editionError } = this.state;

        if(editionError && editionError.status === 404) {
            this.throws(new ResourceNotFoundError(getLangText("Oops, the edition you're looking for doesn't exist.")));
        }
    },

    componentWillUnmount() {
        window.clearInterval(this.state.timerId);
        EditionStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
        if (!state.edition.digital_work) {
            return;
        }
        let isEncoding = state.edition.digital_work.isEncoding;
        if (state.edition.digital_work.mime === 'video' && typeof isEncoding === 'number' && isEncoding !== 100 && !this.state.timerId) {
            let timerId = window.setInterval(() => EditionActions.fetchOne(this.props.params.editionId), 10000);
            this.setState({timerId: timerId});
        }
    },

    loadEdition() {
        EditionActions.fetchOne(this.props.params.editionId);
    },

    render() {
        if(this.state.edition && this.state.edition.id) {
            setDocumentTitle([this.state.edition.artist_name, this.state.edition.title].join(', '));

            return (
                <Edition
                    edition={this.state.edition}
                    loadEdition={this.loadEdition} />
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg'/>
                </div>
            );
        }
    }
});

export default EditionContainer;
