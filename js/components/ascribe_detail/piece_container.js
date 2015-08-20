'use strict';

import React from 'react';
import Router from 'react-router';

import PieceActions from '../../actions/piece_actions';
import PieceStore from '../../stores/piece_store';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import EditionListActions from '../../actions/edition_list_actions';

import Piece from './piece';
import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';
import FurtherDetails from './further_details';

import DetailProperty from './detail_property';

import AclButtonList from './../ascribe_buttons/acl_button_list';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';
import CreateEditionsButton from '../ascribe_buttons/create_editions_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';
import InputTextAreaToggable from '../ascribe_forms/input_textarea_toggable';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';

/**
 * This is the component that implements resource/data specific functionality
 */
let PieceContainer = React.createClass({

    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            PieceStore.getState(),
            {
                showCreateEditionsDialog: false
            }
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
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
        UserStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },


    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    handleEditionCreationSuccess() {
        PieceActions.updateProperty({key: 'num_editions', value: 0});
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);
        this.toggleCreateEditionsDialog();
    },

    handleDeleteSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        // since we're deleting a piece, we just need to close
        // all editions dialogs and not reload them
        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.transitionTo('pieces');
    },

    getCreateEditionsDialog() {
        if(this.state.piece.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div style={{marginTop: '1em'}}>
                    <CreateEditionsForm
                        pieceId={this.state.piece.id}
                        handleSuccess={this.handleEditionCreationSuccess} />
                    <hr/>
                </div>
            );
        } else {
            return (<hr/>);
        }
    },

    handlePollingSuccess(pieceId, numEditions) {

        // we need to refresh the num_editions property of the actual piece we're looking at
        PieceActions.updateProperty({
            key: 'num_editions',
            value: numEditions
        });

        // as well as its representation in the collection
        // btw.: It's not sufficient to just set num_editions to numEditions, since a single accordion
        // list item also uses the firstEdition property which we can only get from the server in that case.
        // Therefore we need to at least refetch the changed piece from the server or on our case simply all
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        let notification = new GlobalNotificationModel('Editions successfully created', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
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
                            {this.state.piece.num_editions > 0 ? <DetailProperty label="EDITIONS" value={ this.state.piece.num_editions } /> : null}
                            <hr/>
                        </div>
                        }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ this.state.piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ this.state.piece.bitcoin_id } ellipsis={true} />
                        </div>
                    }
                    buttons={
                        <AclButtonList
                            className="text-center ascribe-button-list"
                            availableAcls={this.state.piece.acl}
                            editions={this.state.piece}
                            handleSuccess={this.loadPiece}>
                                <CreateEditionsButton
                                    label={getLangText('CREATE EDITIONS')}
                                    className="btn-sm"
                                    piece={this.state.piece}
                                    toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                    onPollingSuccess={this.handlePollingSuccess}/>
                                <DeleteButton
                                    handleSuccess={this.handleDeleteSuccess}
                                    piece={this.state.piece}/>
                        </AclButtonList>
                    }>
                    {this.getCreateEditionsDialog()}
                    <CollapsibleParagraph
                        title="Further Details"
                        show={this.state.piece.acl.acl_edit
                            || Object.keys(this.state.piece.extra_data).length > 0
                            || this.state.piece.other_data.length > 0}
                        defaultExpanded={true}>
                        <FurtherDetails
                            editable={this.state.piece.acl.acl_edit}
                            pieceId={this.state.piece.id}
                            extraData={this.state.piece.extra_data}
                            otherData={this.state.piece.other_data}
                            handleSuccess={this.loadPiece}/>
                    </CollapsibleParagraph>
                    {
                        //<PersonalNote
                        //    piece={this.state.piece}
                        //    currentUser={this.state.currentUser}/>
                    }
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


let PersonalNote = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        currentUser: React.PropTypes.object
    },
    showNotification(){
        let notification = new GlobalNotificationModel(getLangText('Jury note saved'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        if (this.props.currentUser.username && true || false) {
            return (
                <Form
                    url={ApiUrls.note_notes}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='value'
                        label={getLangText('Jury note')}
                        editable={true}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={true}
                            defaultValue={this.props.piece.note_from_user ? this.props.piece.note_from_user.note : null}
                            placeholder={getLangText('Enter your comments...')}/>
                    </Property>
                    <Property hidden={true} name='piece_id'>
                        <input defaultValue={this.props.piece.id}/>
                    </Property>
                    <hr />
                </Form>
            );
        }
        return null;
    }
});


export default PieceContainer;
