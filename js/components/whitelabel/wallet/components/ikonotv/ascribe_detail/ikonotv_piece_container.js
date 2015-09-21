'use strict';

import React from 'react';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import UserStore from '../../../../../../stores/user_store';

import Piece from '../../../../../../components/ascribe_detail/piece';

import AppConstants from '../../../../../../constants/application_constants';

import ListRequestActions from '../../../../../ascribe_forms/list_form_request_actions';
import AclButtonList from '../../../../../ascribe_buttons/acl_button_list';
import DeleteButton from '../../../../../ascribe_buttons/delete_button';
import IkonotvSubmitButton from '../ascribe_buttons/ikonotv_submit_button';

import Form from '../../../../../../components/ascribe_forms/form';
import Property from '../../../../../../components/ascribe_forms/property';
import InputTextAreaToggable from '../../../../../../components/ascribe_forms/input_textarea_toggable';
import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import HistoryIterator from '../../../../../ascribe_detail/history_iterator';
import Note from '../../../../../ascribe_detail/note';

import DetailProperty from '../../../../../ascribe_detail/detail_property';

import AclProxy from '../../../../../acl_proxy';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let IkonotvPieceContainer = React.createClass({
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

    getActions(){
        if (this.state.piece &&
            this.state.piece.notifications &&
            this.state.piece.notifications.length > 0) {
            return (
                <ListRequestActions
                    pieceOrEditions={this.state.piece}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.loadPiece}
                    notifications={this.state.piece.notifications}/>);
        }
        else {

            //We need to disable the normal acl_loan because we're inserting a custom acl_loan button
            let availableAcls;

            if(this.state.piece && this.state.piece.acl && typeof this.state.piece.acl.acl_loan !== 'undefined') {
                // make a copy to not have side effects
                availableAcls = mergeOptions({}, this.state.piece.acl);
                availableAcls.acl_loan = false;
            }

            return (
                <AclButtonList
                    className="text-center ascribe-button-list"
                    availableAcls={availableAcls}
                    editions={this.state.piece}
                    handleSuccess={this.loadPiece}>
                        <AclProxy
                            aclObject={availableAcls}
                            aclName="acl_submit">
                            <IkonotvSubmitButton
                                className="btn-sm"
                                handleSuccess={this.handleSubmitSuccess}
                                piece={this.state.piece}/>
                        </AclProxy>
                        <DeleteButton
                            handleSuccess={this.handleDeleteSuccess}
                            piece={this.state.piece}/>
                </AclButtonList>
            );
        }
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
                    {this.getActions()}
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
                    <IkonotvPieceDetails piece={this.state.piece}/>
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


let IkonotvPieceDetails = React.createClass({
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
                    <Form
                        ref='form'
                        disabled={!this.props.piece.acl.acl_edit}>
                        {Object.keys(this.props.piece.extra_data).map((data, i) => {
                            let label = data.replace('_', ' ');
                            return (
                                <Property
                                    key={i}
                                    name={data}
                                    label={label}
                                    hidden={!this.props.piece.extra_data[data]}>
                                    <InputTextAreaToggable
                                        rows={1}
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

export default IkonotvPieceContainer;
