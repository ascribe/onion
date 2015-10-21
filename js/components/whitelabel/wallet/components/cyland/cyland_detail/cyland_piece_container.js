'use strict';

import React from 'react';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import UserStore from '../../../../../../stores/user_store';

import CylandSubmitButton from '../cyland_buttons/cyland_submit_button';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import CylandAdditionalDataForm from '../cyland_forms/cyland_additional_data_form';

import WalletPieceContainer from '../../ascribe_detail/wallet_piece_container';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { getLangText } from '../../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';

let CylandPieceContainer = React.createClass({
    propTypes: {
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

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
            setDocumentTitle([this.state.piece.artist_name, this.state.piece.title].join(', '));

            return (
                <WalletPieceContainer
                    piece={this.state.piece}
                    currentUser={this.state.currentUser}
                    loadPiece={this.loadPiece}
                    submitButtonType={CylandSubmitButton}>
                    <CollapsibleParagraph
                        title={getLangText('Further Details')}
                        defaultExpanded={true}>
                        <CylandAdditionalDataForm
                            piece={this.state.piece}
                            disabled={!this.state.piece.acl.acl_edit}
                            isInline={true}
                            location={this.props.location}/>
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
