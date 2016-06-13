import React from 'react';

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
import withContext from '../../../../../context/with_context';
import { routerShape } from '../../../../../prop_types';

import { setDocumentTitle } from '../../../../../../utils/dom';
import { mergeOptions } from '../../../../../../utils/general';
import { getLangText } from '../../../../../../utils/lang';


const CylandPieceContainer = React.createClass({
    propTypes: {
        // Injected through HOCs
        router: routerShape.isRequired,

        // Provided from router
        params: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PieceStore.getInitialState(),
            PieceListStore.getState()
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

        if (piece.id) {
            setDocumentTitle(`${piece.artist_name}, ${piece.title}`);

            return (
                <WalletPieceContainer
                    {...this.props}
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    handleDeleteSuccess={this.handleDeleteSuccess}
                    submitButtonType={CylandSubmitButton}>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        defaultExpanded={true}>
                        <CylandAdditionalDataForm
                            piece={piece}
                            disabled={!piece.acl.acl_edit}
                            isInline={true} />
                    </CollapsibleParagraph>
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

export default withContext(CylandPieceContainer, 'router');
