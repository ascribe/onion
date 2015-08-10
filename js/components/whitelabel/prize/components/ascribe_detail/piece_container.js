'use strict';

import React from 'react';

import StarRating from 'react-star-rating';

import PieceActions from '../../../../../actions/piece_actions';
import PieceStore from '../../../../../stores/piece_store';

import PrizeRatingActions from '../../actions/prize_rating_actions';
import PrizeRatingStore from '../../stores/prize_rating_store';

import Piece from '../../../../../components/ascribe_detail/piece';

import AppConstants from '../../../../../constants/application_constants';

import Form from '../../../../../components/ascribe_forms/form';
import Property from '../../../../../components/ascribe_forms/property';
import InputTextAreaToggable from '../../../../../components/ascribe_forms/input_textarea_toggable';
import CollapsibleParagraph from '../../../../../components/ascribe_collapsible/collapsible_paragraph';

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
                    loadPiece={this.loadPiece}>
                    <PrizePieceDetails piece={this.state.piece}/>
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


let PrizePieceDetails = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    getInitialState() {
        return PrizeRatingStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        PrizeRatingStore.listen(this.onChange);
        PrizeRatingActions.fetchOne(this.props.piece.id);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PrizeRatingActions.updateRating({});
        PrizeRatingStore.unlisten(this.onChange);
    },

    onRatingClick(event, args) {
        event.preventDefault();
        PrizeRatingActions.createRating(this.props.piece.id, args.rating);
    },

    render() {
        if (this.props.piece.prize
            && this.props.piece.prize.name
            && Object.keys(this.props.piece.extra_data).length !== 0){
            return (
                <CollapsibleParagraph
                    title="Prize Details"
                    show={true}
                    defaultExpanded={true}>
                    <StarRating
                        name="airbnb-rating"
                        caption=""
                        step={1}
                        size='lg'
                        rating={this.state.currentRating}
                        onRatingClick={this.onRatingClick}
                        ratingAmount={5} />
                    <Form ref='form'>
                        {Object.keys(this.props.piece.extra_data).map((data) => {
                            let label = data.replace('_', ' ');
                            return (
                                <Property
                                    name={data}
                                    label={label}
                                    editable={false}>
                                    <InputTextAreaToggable
                                        rows={1}
                                        editable={false}
                                        defaultValue={this.props.piece.extra_data[data]}/>
                                </Property>);
                            }
                        )}
                        <hr />
                    </Form>
                </CollapsibleParagraph>
            );
        }
        return null;
    }
});

export default PieceContainer;
