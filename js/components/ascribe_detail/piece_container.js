'use strict';

import React from 'react';
import Moment from 'moment';

import ReactError from '../../mixins/react_error';
import { ResourceNotFoundError } from '../../models/errors';

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
import LicenseDetail from './license_detail';
import HistoryIterator from './history_iterator';

import AclButtonList from './../ascribe_buttons/acl_button_list';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';
import CreateEditionsButton from '../ascribe_buttons/create_editions_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import AclInformation from '../ascribe_buttons/acl_information';
import AclProxy from '../acl_proxy';

import ListRequestActions from '../ascribe_forms/list_form_request_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Note from './note';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';
import { setDocumentTitle } from '../../utils/dom_utils';

/**
 * This is the component that implements resource/data specific functionality
 */
let PieceContainer = React.createClass({
    propTypes: {
        furtherDetailsType: React.PropTypes.func,
        params: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    mixins: [ReactError],

    getDefaultProps() {
        return {
            furtherDetailsType: FurtherDetails
        };
    },

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
        PieceStore.listen(this.onChange);

        // Every time we enter the piece detail page, just reset the piece
        // store as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});

        this.loadPiece();
        UserActions.fetchCurrentUser();
    },

    componentDidUpdate() {
        const { pieceError } = this.state;

        if (pieceError && pieceError.status === 404) {
            this.throws(new ResourceNotFoundError(getLangText("Oops, the piece you're looking for doesn't exist.")));
        }
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        /*

            ATTENTION:
            THIS IS JUST A TEMPORARY USABILITY FIX THAT ESSENTIALLY REMOVES THE LOAN BUTTON
            FROM THE PIECE DETAIL PAGE SO THAT USERS DO NOT CONFUSE A PIECE WITH AN EDITION.

            IT SHOULD BE REMOVED AND REPLACED WITH A BETTER SOLUTION ASAP!

            ALSO, WE ENABLED THE LOAN BUTTON FOR IKONOTV TO LET THEM LOAN ON A PIECE LEVEL

         */
        if(state && state.piece && state.piece.acl && typeof state.piece.acl.acl_loan !== 'undefined') {

            let pieceState = mergeOptions({}, state.piece);
            pieceState.acl.acl_loan = false;
            this.setState({
                piece: pieceState
            });

        } else {
            this.setState(state);
        }
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

        this.context.router.push({ pathname: '/collection' });
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

    getId() {
        return {'id': this.state.piece.id};
    },

    getActions() {
        const { piece, currentUser } = this.state;

        if (piece && piece.notifications && piece.notifications.length > 0) {
            return (
                <ListRequestActions
                    pieceOrEditions={piece}
                    currentUser={currentUser}
                    handleSuccess={this.loadPiece}
                    notifications={piece.notifications}/>);
        } else {
            return (
                <AclProxy
                    show={currentUser && currentUser.email && Object.keys(piece.acl).length > 1}>
                    {/*
                        `acl_view` is always available in `edition.acl`, therefore if it has
                        no more than 1 key, we're hiding the `DetailProperty` actions as otherwise
                        `AclInformation` would show up
                    */}
                    <DetailProperty
                        label={getLangText('ACTIONS')}
                        className="hidden-print">
                        <AclButtonList
                            className="ascribe-button-list"
                            availableAcls={piece.acl}
                            pieceOrEditions={piece}
                            handleSuccess={this.loadPiece}>
                                <CreateEditionsButton
                                    label={getLangText('CREATE EDITIONS')}
                                    className="btn-sm"
                                    piece={piece}
                                    toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                    onPollingSuccess={this.handlePollingSuccess}/>
                                <DeleteButton
                                    handleSuccess={this.handleDeleteSuccess}
                                    piece={piece}/>
                                <AclInformation
                                    aim="button"
                                    verbs={['acl_share', 'acl_transfer', 'acl_create_editions', 'acl_loan', 'acl_delete',
                                            'acl_consign']}
                                    aclObject={piece.acl}/>
                        </AclButtonList>
                    </DetailProperty>
                </AclProxy>
            );
        }
    },

    render() {
        if (this.state.piece && this.state.piece.id) {
            let FurtherDetailsType = this.props.furtherDetailsType;
            setDocumentTitle([this.state.piece.artist_name, this.state.piece.title].join(', '));

            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <hr className="hidden-print" style={{marginTop: 0}}/>
                            <h1 className="ascribe-detail-title">{this.state.piece.title}</h1>
                            <DetailProperty label="BY" value={this.state.piece.artist_name} />
                            <DetailProperty label="DATE" value={Moment(this.state.piece.date_created, 'YYYY-MM-DD').year() } />
                            {this.state.piece.num_editions > 0 ? <DetailProperty label="EDITIONS" value={ this.state.piece.num_editions } /> : null}
                            <hr/>
                        </div>
                        }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ this.state.piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ this.state.piece.bitcoin_id } ellipsis={true} />
                            <LicenseDetail license={this.state.piece.license_type} />
                        </div>
                    }
                    buttons={this.getActions()}>
                    {this.getCreateEditionsDialog()}
                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.state.piece.loan_history && this.state.piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={this.state.piece.loan_history} />
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Notes')}
                        show={!!(this.state.currentUser.username
                                || this.state.piece.acl.acl_edit
                                || this.state.piece.public_note)}>
                        <Note
                            id={this.getId}
                            label={getLangText('Personal note (private)')}
                            defaultValue={this.state.piece.private_note || null}
                            show = {!!this.state.currentUser.username}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_piece}
                            currentUser={this.state.currentUser}/>
                        <Note
                            id={this.getId}
                            label={getLangText('Personal note (public)')}
                            defaultValue={this.state.piece.public_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={!!this.state.piece.acl.acl_edit}
                            show={!!(this.state.piece.public_note || this.state.piece.acl.acl_edit)}
                            successMessage={getLangText('Public note saved')}
                            url={ApiUrls.note_public_piece}
                            currentUser={this.state.currentUser}/>
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={this.state.piece.acl.acl_edit
                            || Object.keys(this.state.piece.extra_data).length > 0
                            || this.state.piece.other_data.length > 0}
                        defaultExpanded={true}>
                        <FurtherDetailsType
                            editable={this.state.piece.acl.acl_edit}
                            pieceId={this.state.piece.id}
                            extraData={this.state.piece.extra_data}
                            otherData={this.state.piece.other_data}
                            handleSuccess={this.loadPiece} />
                    </CollapsibleParagraph>

                </Piece>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg'/>
                </div>
            );
        }
    }
});

export default PieceContainer;
