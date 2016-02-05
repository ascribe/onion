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
        actionPanelButtonListType: React.PropTypes.func,
        furtherDetailsType: React.PropTypes.func,

        // Provided from AscribeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [History, ReactError],

    getInitialState() {
        return EditionStore.getInitialState();
    },

    componentDidMount() {
        EditionStore.listen(this.onChange);

        this.loadEdition();
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces)
    componentWillReceiveProps(nextProps) {
        if (this.props.params.editionId !== nextProps.params.editionId) {
            EditionActions.flushEdition();
            this.loadEdition(nextProps.params.editionId);
        }
    },

    componentDidUpdate() {
        const { err: editionErr } = this.state.editionMeta;

        if (editionErr && editionErr.json && editionErr.json.status === 404) {
            this.throws(new ResourceNotFoundError(getLangText("Oops, the edition you're looking for doesn't exist.")));
        }
    },

    componentWillUnmount() {
        window.clearInterval(this.state.timerId);
        EditionStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadEdition(editionId = this.props.params.editionId) {
        EditionActions.fetchEdition(editionId);
    },

    render() {
        const { actionPanelButtonListType, currentUser, furtherDetailsType, whitelabel } = this.props;
        const { edition, coaMeta } = this.state;

        if (edition.id) {
            setDocumentTitle(`${edition.artist_name}, ${edition.title}`);

            return (
                <Edition
                    actionPanelButtonListType={actionPanelButtonListType}
                    coaError={coaMeta.err}
                    currentUser={currentUser}
                    edition={edition}
                    furtherDetailsType={furtherDetailsType}
                    loadEdition={this.loadEdition}
                    whitelabel={whitelabel} />
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
