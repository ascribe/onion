'use strict';

import React from 'react';
import Moment from 'moment';

import WalletActionPanel from './wallet_action_panel';

import CollapsibleParagraph from '../../../../../components/ascribe_collapsible/collapsible_paragraph';

import DetailProperty from '../../../../ascribe_detail/detail_property';
import HistoryIterator from '../../../../ascribe_detail/history_iterator';
import Note from '../../../../ascribe_detail/note';
import Piece from '../../../../../components/ascribe_detail/piece';

import AscribeSpinner from '../../../../ascribe_spinner';

import ApiUrls from '../../../../../constants/api_urls';

import { getLangText } from '../../../../../utils/lang_utils';


let WalletPieceContainer = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        loadPiece: React.PropTypes.func.isRequired,
        handleDeleteSuccess: React.PropTypes.func.isRequired,
        submitButtonType: React.PropTypes.func.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },


    render() {
        if (this.props.piece && this.props.piece.id) {
            return (
                <Piece
                    piece={this.props.piece}
                    loadPiece={this.props.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <hr style={{marginTop: 0}}/>
                            <h1 className="ascribe-detail-title">{this.props.piece.title}</h1>
                            <DetailProperty label="BY" value={this.props.piece.artist_name} />
                            <DetailProperty label="DATE" value={Moment(this.props.piece.date_created, 'YYYY-MM-DD').year()} />
                            <hr/>
                        </div>
                    }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ this.props.piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ this.props.piece.bitcoin_id } ellipsis={true} />
                            <hr/>
                        </div>
                    }>
                    <WalletActionPanel
                        piece={this.props.piece}
                        currentUser={this.props.currentUser}
                        loadPiece={this.props.loadPiece}
                        handleDeleteSuccess={this.props.handleDeleteSuccess}
                        submitButtonType={this.props.submitButtonType}/>
                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.props.piece.loan_history && this.props.piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={this.props.piece.loan_history}/>
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Notes')}
                        show={!!(this.props.currentUser.username || this.props.piece.public_note)}>
                        <Note
                            id={() => {return {'id': this.props.piece.id}; }}
                            label={getLangText('Personal note (private)')}
                            defaultValue={this.props.piece.private_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_piece}
                            currentUser={this.props.currentUser}/>
                    </CollapsibleParagraph>
                    {this.props.children}
                </Piece>
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

export default WalletPieceContainer;
