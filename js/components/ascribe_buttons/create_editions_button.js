'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';

import classNames from 'classnames';

let CreateEditionsButton = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        className: React.PropTypes.string,
        piece: React.PropTypes.object.isRequired,
        toggleCreateEditionsDialog: React.PropTypes.func.isRequired,
        onPollingSuccess: React.PropTypes.func
    },

    getInitialState() {
        return EditionListStore.getState();
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        EditionListStore.unlisten(this.onChange);
        clearInterval(this.state.pollingIntervalIndex);
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidUpdate() {
        if(this.props.piece.num_editions === 0 && typeof this.state.pollingIntervalIndex === 'undefined') {
            this.startPolling();
        }
    },

    startPolling() {
        // start polling until editions are defined
        let pollingIntervalIndex = setInterval(() => {

            // requests, will try to merge the filterBy parameter with other parameters (mergeOptions).
            // Therefore it can't but null but instead has to be an empty object
            EditionListActions.fetchEditionList(this.props.piece.id, null, null, null, null, {})
            .then((res) => {

                clearInterval(this.state.pollingIntervalIndex);
                this.props.onPollingSuccess(this.props.piece.id, res.editions[0].num_editions);

            })
            .catch((err) => {
                /* Ignore and keep going */
            });
        }, 5000);

        this.setState({
            pollingIntervalIndex
        });
    },

    render: function () {
        let piece = this.props.piece;

        if (!piece.acl.acl_create_editions || piece.num_editions > 0){
            return null;
        }

        if(piece.num_editions === 0 && typeof this.state.editionList[piece.id] === 'undefined') {
            return (
                <button
                    disabled
                    className={classNames('btn', this.props.className)}>
                    {getLangText('Creating editions')} <AscribeSpinner
                        size='sm'
                        color='white'
                        classNames='pull-right margin-left-2px'/>
                </button>
            );
        } else {
            return (
                <button
                    className={classNames('btn', this.props.className)}
                    onClick={this.props.toggleCreateEditionsDialog}>
                    {this.props.label}
                </button>
            );
        }
    }
});

export default CreateEditionsButton;

