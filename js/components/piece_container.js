import React from 'react';

import PieceActions from '../actions/piece_actions';
import PieceStore from '../stores/piece_store';

import Piece from './piece';

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
        PieceActions.fetchOne(this.props.params.pieceId);
        PieceStore.listen(this.onChange);
    },

    componentDidUnmount() {
        PieceStore.unlisten(this.onChange);
    },

    render() {

        if('title' in this.state.piece) {
            return (
                <Piece title={this.state.piece.title}></Piece>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }

        
    }
});

export default PieceContainer; 
