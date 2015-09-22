'use strict';

import React from 'react';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import UserStore from '../../../../../../stores/user_store';


import IkonotvSubmitButton from '../ascribe_buttons/ikonotv_submit_button';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import IkonotvArtistDetailsForm from '../ascribe_forms/ikonotv_artist_details_form';
import IkonotvArtworkDetailsForm from '../ascribe_forms/ikonotv_artwork_details_form';

import WalletPieceContainer from '../../ascribe_detail/wallet_piece_container';

import AppConstants from '../../../../../../constants/application_constants';

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
        UserStore.listen(this.onChange);

        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});

        this.loadPiece();
    },

     // We need this for when the user clicks on a notification while being in another piece view
    componentWillReceiveProps(nextProps) {
        if(this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.updatePiece({});
            PieceActions.fetchOne(nextProps.params.pieceId);
        }
    },

    componentWillUnmount() {
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
                <WalletPieceContainer
                    piece={this.state.piece}
                    currentUser={this.state.currentUser}
                    loadPiece={this.loadPiece}
                    submitButtonType={IkonotvSubmitButton}>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        show={true}
                        defaultExpanded={true}>
                        <IkonotvArtistDetailsForm
                            piece={this.state.piece}
                            isInline={true}
                            disabled={!this.state.piece.acl.acl_edit} />
                        <IkonotvArtworkDetailsForm
                            piece={this.state.piece}
                            isInline={true}
                            disabled={!this.state.piece.acl.acl_edit} />
                    </CollapsibleParagraph>
                </WalletPieceContainer>
            );
        }
        else {
            return (
                <div className="fullpage-spinner">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

export default IkonotvPieceContainer;
