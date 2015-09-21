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

import HistoryIterator from '../../../../../ascribe_detail/history_iterator';
import Note from '../../../../../ascribe_detail/note';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';
import DetailProperty from '../../../../../ascribe_detail/detail_property';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


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

    componentWillReceiveProps(nextProps) {
        if(this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.updatePiece({});
            PieceActions.fetchOne(nextProps.params.pieceId);
        }
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

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    render() {
        if(this.state.piece && this.state.piece.title) {
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
                        }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ this.state.piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ this.state.piece.bitcoin_id } ellipsis={true} />
                            <hr/>
                        </div>
                    }>

                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.state.piece.loan_history && this.state.piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={this.state.piece.loan_history} />
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Notes')}
                        show={!!(this.state.currentUser.username || this.state.piece.public_note)}>
                        <Note
                            id={() => {return {'id': this.state.piece.id}; }}
                            label={getLangText('Personal note (private)')}
                            defaultValue={this.state.piece.private_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_piece}
                            currentUser={this.state.currentUser}/>
                    </CollapsibleParagraph>
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
        if (this.props.piece && Object.keys(this.props.piece.extra_data).length !== 0){
            return (
                <CollapsibleParagraph
                    title={getLangText('Further Details')}
                    show={true}
                    defaultExpanded={true}>
                    <Form ref='form'>
                        {Object.keys(this.props.piece.extra_data).map((data, i) => {
                            let label = data.replace('_', ' ');
                            return (
                                <Property
                                    key={i}
                                    name={data}
                                    label={label}
                                    editable={false}
                                    overrideForm={true}>
                                    <InputTextAreaToggable
                                        rows={1}
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
