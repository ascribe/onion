'use strict';

import React from 'react';
import { History } from 'react-router';

import EditionListActions from '../../../../../../actions/edition_list_actions';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import PieceListStore from '../../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../../actions/piece_list_actions';

import CylandAdditionalDataForm from '../cyland_forms/cyland_additional_data_form';

import CylandSubmitButton from '../cyland_buttons/cyland_submit_button';

import WalletPieceContainer from '../../ascribe_detail/wallet_piece_container';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let CylandPieceContainer = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            PieceStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);

        // Every time we enter the piece detail page, just reset the piece
        // store as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});

        this.loadPiece();
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
        PieceListStore.listen(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    handleDeleteSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        // since we're deleting a piece, we just need to close
        // all editions dialogs and not reload them
        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        const notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.history.push('/collection');
    },

    render() {
        if (this.state.piece && this.state.piece.id) {
            const { currentUser } = this.props;

            setDocumentTitle([this.state.piece.artist_name, this.state.piece.title].join(', '));

            return (
                <WalletPieceContainer
                    {...this.props}
                    piece={this.state.piece}
                    currentUser={currentUser}
                    loadPiece={this.loadPiece}
                    handleDeleteSuccess={this.handleDeleteSuccess}
                    submitButtonType={CylandSubmitButton}>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        defaultExpanded={true}>
                        <CylandAdditionalDataForm
                            piece={this.state.piece}
                            disabled={!this.state.piece.acl.acl_edit}
                            isInline={true} />
                    </CollapsibleParagraph>
                </WalletPieceContainer>
            );
        }
        else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg' />
                </div>
            );
        }
    }
});

export default CylandPieceContainer;
