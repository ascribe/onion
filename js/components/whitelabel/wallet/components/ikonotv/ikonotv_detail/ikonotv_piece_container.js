'use strict';

import React from 'react';
import { History } from 'react-router';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import UserStore from '../../../../../../stores/user_store';

import PieceListStore from '../../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../../actions/piece_list_actions';

import EditionListActions from '../../../../../../actions/edition_list_actions';

import IkonotvSubmitButton from '../ikonotv_buttons/ikonotv_submit_button';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import IkonotvArtistDetailsForm from '../ikonotv_forms/ikonotv_artist_details_form';
import IkonotvArtworkDetailsForm from '../ikonotv_forms/ikonotv_artwork_details_form';

import WalletPieceContainer from '../../ascribe_detail/wallet_piece_container';

import AscribeSpinner from '../../../../../ascribe_spinner';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let IkonotvPieceContainer = React.createClass({
    propTypes: {
        params: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            PieceStore.getInitialState(),
            UserStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);

        this.loadPiece();
    },

    // We need this for when the user clicks on a notification while being in another piece view
    componentWillReceiveProps(nextProps) {
        if (this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.flushPiece();
            this.loadPiece();
        }
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceListStore.listen(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchPiece(this.props.params.pieceId);
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

        this.history.push('/collection');
    },

    render() {
        const { piece } = this.state;

        let furtherDetails = (
            <CollapsibleParagraph
                title={getLangText('Further Details')}
                defaultExpanded={true}>
                <span>{getLangText('This piece has been loaned before we started to collect further details.')}</span>
            </CollapsibleParagraph>
        );

        if (piece.extra_data && Object.keys(piece.extra_data).length && piece.acl) {
            furtherDetails = (
                <CollapsibleParagraph
                    title={getLangText('Further Details')}
                    defaultExpanded={true}>
                    <IkonotvArtistDetailsForm
                        piece={piece}
                        isInline={true}
                        disabled={!piece.acl.acl_edit} />
                    <IkonotvArtworkDetailsForm
                        piece={piece}
                        isInline={true}
                        disabled={!piece.acl.acl_edit} />
                </CollapsibleParagraph>
            );
        }

        if (piece.id) {
            setDocumentTitle(`${piece.artist_name}, ${piece.title}`);

            return (
                <WalletPieceContainer
                    piece={piece}
                    currentUser={this.state.currentUser}
                    loadPiece={this.loadPiece}
                    handleDeleteSuccess={this.handleDeleteSuccess}
                    submitButtonType={IkonotvSubmitButton}>
                    {furtherDetails}
                </WalletPieceContainer>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg' />
                </div>
            );
        }
    }
});

export default IkonotvPieceContainer;
