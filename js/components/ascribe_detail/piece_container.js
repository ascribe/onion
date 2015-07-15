'use strict';

import React from 'react';

import PieceActions from '../../actions/piece_actions';
import PieceStore from '../../stores/piece_store';

import Piece from './piece';
import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';
import FurtherDetails from './further_details';

import AppConstants from '../../constants/application_constants';

/**
 * This is the component that implements resource/data specific functionality
 */
let PieceContainer = React.createClass({
    getInitialState() {
        return PieceStore.getState();
    },

    onChange(state) {
        this.setState(state);
        if (!state.piece.digital_work) {
            return;
        }
        let isEncoding = state.piece.digital_work.isEncoding;
        if (state.piece.digital_work.mime === 'video' && typeof isEncoding === 'number' && isEncoding !== 100 && !this.state.timerId) {
            let timerId = window.setInterval(() => PieceActions.fetchOne(this.props.params.pieceId), 10000);
            this.setState({timerId: timerId});
        }
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});
        window.clearInterval(this.state.timerId);
        PieceStore.unlisten(this.onChange);
    },


    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    render() {
        if('title' in this.state.piece) {
            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}>
                    <CollapsibleParagraph
                        title="Further Details"
                        show={this.state.piece.acl.acl_edit
                            || Object.keys(this.state.piece.extra_data).length > 0
                            || this.state.piece.other_data !== null}
                        defaultExpanded={true}>
                        <FurtherDetails
                            editable={this.state.piece.acl.acl_edit}
                            pieceId={this.state.piece.id}
                            extraData={this.state.piece.extra_data}
                            otherData={this.state.piece.other_data}
                            handleSuccess={this.loadPiece}/>
                    </CollapsibleParagraph>
                </Piece>
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

export default PieceContainer;
