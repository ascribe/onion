'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';
import PieceListActions from '../../actions/piece_list_actions';

import { getAvailableAcls } from '../../utils/acl_utils';

let CreateEditionsButton = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired,
        toggleCreateEditionsDialog: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {};
    },

    componentDidUpdate() {
        if(this.props.piece.num_editions === 0 && typeof this.state.pollingIntervalIndex === 'undefined') {
            this.startPolling();
        }
    },

    componentWillUnmount() {
        clearInterval(this.state.pollingIntervalIndex);
    },

    startPolling() {
        // start polling until editions are defined
        let pollingIntervalIndex = setInterval(() => {
            EditionListActions.fetchEditionList(this.props.piece.id)
            .then((res) => {

                clearInterval(this.state.pollingIntervalIndex);

                PieceListActions.updatePropertyForPiece({
                    pieceId: this.props.piece.id,
                    key: 'num_editions',
                    value: res.editions[0].num_editions
                });

                EditionListActions.toggleEditionList(this.props.piece.id);

            })
            .catch(() => {
                /* Ignore and keep going */
            });
        }, 5000);

        this.setState({
            pollingIntervalIndex
        });
    },

    render: function () {
        let piece = this.props.piece;

        let availableAcls = getAvailableAcls(piece);
        if (availableAcls.indexOf('editions') < -1 || piece.num_editions > 0){
            return null;
        }

        if(piece.num_editions === 0) {
            return (
                <button disabled className="btn btn-default btn-sm">
                    CREATING EDITIONS <span className="glyph-ascribe-spool-chunked spin"/>
                </button>
            );
        } else {
            return (
                <button 
                    className="btn btn-default btn-sm"
                    onClick={this.props.toggleCreateEditionsDialog}>
                    CREATE EDITIONS
                </button>
            );
        }
    }
});

export default CreateEditionsButton;

