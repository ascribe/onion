import React from 'react';

import PieceActions from '../actions/piece_actions';
import PieceStore from '../stores/piece_store';

import PieceDetail from './ascribe_piece_detail/piece_detail';

/**
 * This is the component that implements resource/data specific functionality
 */
let Piece = React.createClass({

    getInitialState() {
        return PieceStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        PieceActions.fetchOne(this.props.params.pieceId);
        PieceStore.listen(this.onChange);
    },

    componentDidUnmount() {
        PieceStore.unlisten(this.onChange);
    },

    render() {

        if('title' in this.state.piece) {
            return (
                <PieceDetail title={this.state.piece.title}></PieceDetail>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }

        
    }
});

export default Piece; 
