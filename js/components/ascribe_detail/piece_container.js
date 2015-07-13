'use strict';

import React from 'react';

import PieceActions from '../../actions/piece_actions';
import PieceStore from '../../stores/piece_store';

import Piece from './piece';

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
                    loadPiece={this.loadPiece}/>
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
