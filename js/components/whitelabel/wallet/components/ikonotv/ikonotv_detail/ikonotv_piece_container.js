import React from 'react';
import withRouter from 'react-router/es6/withRouter';

import EditionListActions from '../../../../../../actions/edition_list_actions';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import PieceListStore from '../../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../../actions/piece_list_actions';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import IkonotvSubmitButton from '../ikonotv_buttons/ikonotv_submit_button';

import IkonotvArtistDetailsForm from '../ikonotv_forms/ikonotv_artist_details_form';
import IkonotvArtworkDetailsForm from '../ikonotv_forms/ikonotv_artwork_details_form';

import WalletPieceContainer from '../../ascribe_detail/wallet_piece_container';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


const IkonotvPieceContainer = React.createClass({
    propTypes: {
        router: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            PieceStore.getInitialState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
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

        this.props.router.push('/collection');
    },

    render() {
        const { piece } = this.state;

        let furtherDetails = (
            <CollapsibleParagraph
                title={getLangText('Further Details')}
                defaultExpanded={true}>
                <span>{getLangText('This piece was loanded before any further details were collected.')}</span>
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

export default withRouter(IkonotvPieceContainer);
