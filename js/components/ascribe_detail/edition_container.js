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
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object,
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
        EditionActions.flushEdition();
        EditionActions.fetchEdition(this.props.params.editionId);
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces)
    componentWillReceiveProps(nextProps) {
        if (this.props.params.editionId !== nextProps.params.editionId) {
            EditionActions.fetchEdition(this.props.params.editionId);
        }
    },

    componentDidUpdate() {
        const { editionMeta } = this.state;
        if (editionMeta.err && editionMeta.err.json && editionMeta.err.json.status === 404) {
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

    render() {
        const { actionPanelButtonListType, currentUser, furtherDetailsType, whitelabel } = this.props;
        const { edition, coaMeta } = this.state;

        if (Object.keys(edition).length && edition.id) {
            setDocumentTitle([edition.artist_name, edition.title].join(', '));

            return (
                <Edition
                    actionPanelButtonListType={actionPanelButtonListType}
                    coaError={coaMeta.err}
                    currentUser={currentUser}
                    edition={edition}
                    furtherDetailsType={furtherDetailsType}
                    loadEdition={() => EditionActions.fetchEdition(this.props.params.editionId)}
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
