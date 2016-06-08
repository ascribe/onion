'use strict';

import React from 'react';
import Moment from 'moment';

import ReactError from '../../mixins/react_error';
import { ResourceNotFoundError } from '../../models/errors';

import EditionListActions from '../../actions/edition_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import PieceActions from '../../actions/piece_actions';
import PieceStore from '../../stores/piece_store';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import FurtherDetails from './further_details';
import DetailProperty from './detail_property';
import HistoryIterator from './history_iterator';
import LicenseDetail from './license_detail';
import Note from './note';
import Piece from './piece';

import AclButtonList from '../ascribe_buttons/acl_button_list';
import AclInformation from '../ascribe_buttons/acl_information';
import CreateEditionsButton from '../ascribe_buttons/create_editions_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import CreateEditionsForm from '../ascribe_forms/create_editions_form';
import ListRequestActions from '../ascribe_forms/list_form_request_actions';

import AclProxy from '../acl_proxy';
import AscribeSpinner from '../ascribe_spinner';
import withContext from '../context/with_context';
import { routerShape } from '../prop_types';

import ApiUrls from '../../constants/api_urls';

import { setDocumentTitle } from '../../utils/dom_utils';
import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';

/**
 * This is the component that implements resource/data specific functionality
 */
const PieceContainer = React.createClass({
    propTypes: {
        furtherDetailsType: React.PropTypes.func,

        // Injected through HOCs
        isLoggedIn: React.PropTypes.bool.isRequired, // eslint-disable-line react/sort-prop-types
        router: routerShape.isRequired, // eslint-disable-line react/sort-prop-types

        // Provided from router
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [ReactError],

    getDefaultProps() {
        return {
            furtherDetailsType: FurtherDetails
        };
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            PieceStore.getInitialState(),
            {
                showCreateEditionsDialog: false
            }
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        PieceStore.listen(this.onChange);

        this.loadPiece();
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces) or
    // when the user clicks on a notification while being in another piece view
    componentWillReceiveProps(nextProps) {
        if (this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.flushPiece();
            this.loadPiece(nextProps.params.pieceId);
        }
    },

    componentDidUpdate() {
        const { err: pieceErr } = this.state.pieceMeta;

        if (pieceErr && pieceErr.json && pieceErr.json.status === 404) {
            this.throws(new ResourceNotFoundError(getLangText("Oops, the piece you're looking for doesn't exist.")));
        }
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
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
        if (state && state.piece && state.piece.acl && typeof state.piece.acl.acl_loan !== 'undefined') {
            let pieceState = mergeOptions({}, state.piece);
            pieceState.acl.acl_loan = false;
            this.setState({
                piece: pieceState
            });

        } else {
            this.setState(state);
        }
    },

    loadPiece(pieceId = this.props.params.pieceId) {
        PieceActions.fetchPiece(pieceId);
    },

    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    handleEditionCreationSuccess() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceActions.updateProperty({ key: 'num_editions', value: 0 });
        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        this.toggleCreateEditionsDialog();
    },

    handleDeleteSuccess(response) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        // since we're deleting a piece, we just need to close
        // all editions dialogs and not reload them
        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        const notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.props.router.push('/collection');
    },

    getCreateEditionsDialog() {
        if (this.state.piece.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div style={{marginTop: '1em'}}>
                    <CreateEditionsForm
                        pieceId={this.state.piece.id}
                        handleSuccess={this.handleEditionCreationSuccess} />
                    <hr />
                </div>
            );
        } else {
            return (<hr />);
        }
    },

    handlePollingSuccess(pieceId, numEditions) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        // we need to refresh the num_editions property of the actual piece we're looking at
        PieceActions.updateProperty({
            key: 'num_editions',
            value: numEditions
        });

        // as well as its representation in the collection
        // btw.: It's not sufficient to just set num_editions to numEditions, since a single accordion
        // list item also uses the firstEdition property which we can only get from the server in that case.
        // Therefore we need to at least refetch the changed piece from the server or on our case simply all
        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        const notification = new GlobalNotificationModel(getLangText('Editions successfully created'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getId() {
        return { 'id': this.state.piece.id };
    },

    getActions() {
        const { piece } = this.state;
        const { isLoggedIn } = this.props;

        if (piece.notifications && piece.notifications.length > 0) {
            return (
                <ListRequestActions
                    handleSuccess={this.loadPiece}
                    notifications={piece.notifications}
                    pieceOrEditions={piece} />
            );
        } else {
            return (
                <AclProxy
                    show={isLoggedIn && Object.keys(piece.acl).length > 1}>
                    {/*
                        `acl_view` is always available in `edition.acl`, therefore if it has
                        no more than 1 key, we're hiding the `DetailProperty` actions as otherwise
                        `AclInformation` would show up
                    */}
                    <DetailProperty
                        label={getLangText('ACTIONS')}
                        className="hidden-print">
                        <AclButtonList
                            availableAcls={piece.acl}
                            className="ascribe-button-list"
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
                                    piece={piece} />
                                <AclInformation
                                    aim="button"
                                    verbs={['acl_share', 'acl_transfer', 'acl_create_editions', 'acl_loan', 'acl_delete',
                                            'acl_consign']}
                                    aclObject={piece.acl} />
                        </AclButtonList>
                    </DetailProperty>
                </AclProxy>
            );
        }
    },

    render() {
        const { isLoggedIn, furtherDetailsType: FurtherDetailsType } = this.props;
        const { piece } = this.state;

        if (piece.id) {
            setDocumentTitle(`${piece.artist_name}, ${piece.title}`);

            return (
                <Piece
                    piece={piece}
                    header={
                        <div className="ascribe-detail-header">
                            <hr className="hidden-print" style={{marginTop: 0}} />
                            <h1 className="ascribe-detail-title">{piece.title}</h1>
                            <DetailProperty label="CREATED BY" value={piece.artist_name} />
                            <DetailProperty label="YEAR OF CREATION" value={Moment(piece.date_created, 'YYYY-MM-DD').year() } />
                            {piece.num_editions > 0 ? <DetailProperty label="EDITIONS" value={ piece.num_editions } /> : null}
                            <hr/>
                        </div>
                        }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('ASCRIBED BY')} value={ piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ piece.bitcoin_id } ellipsis={true} />
                            <DetailProperty
                                label="DATE OF TIMESTAMPING"
                                value={Moment(piece.datetime_registered).format('MMM. DD, YYYY, h:mm:ss')} />
                            <LicenseDetail license={piece.license_type} />
                        </div>
                    }
                    buttons={this.getActions()}>
                    {this.getCreateEditionsDialog()}
                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={piece.loan_history && piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={piece.loan_history} />
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Notes')}
                        show={!!(isLoggedIn || piece.acl.acl_edit || piece.public_note)}>
                        <Note
                            id={this.getId}
                            label={getLangText('Personal note (private)')}
                            defaultValue={piece.private_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_piece} />
                        <Note
                            id={this.getId}
                            label={getLangText('Personal note (public)')}
                            defaultValue={piece.public_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={!!piece.acl.acl_edit}
                            show={!!(piece.public_note || piece.acl.acl_edit)}
                            successMessage={getLangText('Public note saved')}
                            url={ApiUrls.note_public_piece} />
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={piece.acl.acl_edit
                            || Object.keys(piece.extra_data).length > 0
                            || piece.other_data.length > 0}
                        defaultExpanded={true}>
                        <FurtherDetailsType
                            editable={piece.acl.acl_edit}
                            pieceId={piece.id}
                            extraData={piece.extra_data}
                            otherData={piece.other_data}
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

export default withContext(PieceContainer, 'isLoggedIn', 'router');
