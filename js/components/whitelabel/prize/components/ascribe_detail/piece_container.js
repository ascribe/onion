'use strict';

import React from 'react';

import PieceActions from '../../../../../actions/piece_actions';
import PieceStore from '../../../../../stores/piece_store';

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
                    <CollapsibleParagraph
                        title="Prize Details"
                        show={true}
                        defaultExpanded={true}>
                        <Form
                            ref='form'>
                            <Property
                                name='test'
                                label='test'
                                editable={false}>
                                <InputTextAreaToggable
                                    rows={1}
                                    editable={false}
                                    defaultValue='test'/>
                            </Property>
                            <hr />
                        </Form>
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
