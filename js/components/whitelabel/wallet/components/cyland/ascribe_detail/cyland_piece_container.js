'use strict';

import React from 'react';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import UserStore from '../../../../../../stores/user_store';

import Piece from '../../../../../../components/ascribe_detail/piece';

import AppConstants from '../../../../../../constants/application_constants';

import Form from '../../../../../../components/ascribe_forms/form';
import Property from '../../../../../../components/ascribe_forms/property';
import InputTextAreaToggable from '../../../../../../components/ascribe_forms/input_textarea_toggable';
import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';
import DetailProperty from '../../../../../ascribe_detail/detail_property';

import { mergeOptions } from '../../../../../../utils/general_utils';
import { getLangText } from '../../../../../../utils/lang_utils';

/**
 * This is the component that implements resource/data specific functionality
 */
let CylandPieceContainer = React.createClass({
    getInitialState() {
        return mergeOptions(
            PieceStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceActions.fetchOne(this.props.params.pieceId);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});
        PieceStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.updatePiece({});
            PieceActions.fetchOne(nextProps.params.pieceId);
        }
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    render() {
        if('title' in this.state.piece) {
            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <hr style={{marginTop: 0}}/>
                            <h1 className="ascribe-detail-title">{this.state.piece.title}</h1>
                            <DetailProperty label="BY" value={this.state.piece.artist_name} />
                            <DetailProperty label="DATE" value={ this.state.piece.date_created.slice(0, 4) } />
                            <hr/>
                        </div>
                        }>
                    <CylandPieceDetails piece={this.state.piece}/>
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


let CylandPieceDetails = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    render() {
        if (Object.keys(this.props.piece.extra_data).length !== 0){
            return (
                <CollapsibleParagraph
                    title="Further Details"
                    show={true}
                    defaultExpanded={true}>
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
                        <FurtherDetailsFileuploader
                            editable={false}
                            pieceId={this.props.piece.id}
                            otherData={this.props.piece.other_data}
                            multiple={false}/>
                        <hr />
                    </Form>
                </CollapsibleParagraph>
            );
        }
        return null;
    }
});

export default CylandPieceContainer;
