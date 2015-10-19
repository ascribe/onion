'use strict';

import React from 'react';
import { History } from 'react-router';

import EditionActions from '../../actions/edition_actions';
import EditionStore from '../../stores/edition_store';

import Edition from './edition';

import AppConstants from '../../constants/application_constants';


/**
 * This is the component that implements resource/data specific functionality
 */
let EditionContainer = React.createClass({
    propTypes: {
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        return EditionStore.getState();
    },

    componentDidMount() {
        // Every time we're entering the edition detail page,
        // just reset the edition that is saved in the edition store
        // as it will otherwise display wrong/old data once the user loads
        // the edition detail a second time
        EditionActions.updateEdition({});

        EditionStore.listen(this.onChange);
        EditionActions.fetchOne(this.props.params.editionId);
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
            // Even though the /404 path doesn't really exist,
            // we can still redirect there and the page will show up
            this.history.pushState(null, '/404');
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
        if(this.state.edition && this.state.edition.title) {
            return (
                <Edition
                    edition={this.state.edition}
                    loadEdition={this.loadEdition}
                    location={this.props.location}/>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

export default EditionContainer;
