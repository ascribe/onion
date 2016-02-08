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
        handleDeleteSuccess: React.PropTypes.func.isRequired,
        loadPiece: React.PropTypes.func.isRequired,
        submitButtonType: React.PropTypes.func.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    render() {
        const { children,
                currentUser,
                handleDeleteSuccess,
                loadPiece,
                piece,
                submitButtonType } = this.props;

        if (piece && piece.id) {
            return (
                <Piece
                    piece={piece}
                    currentUser={currentUser}
                    header={
                        <div className="ascribe-detail-header">
                            <hr style={{marginTop: 0}}/>
                            <h1 className="ascribe-detail-title">{piece.title}</h1>
                            <DetailProperty label="BY" value={piece.artist_name} />
                            <DetailProperty label="DATE" value={Moment(piece.date_created, 'YYYY-MM-DD').year()} />
                            <hr/>
                        </div>
                    }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ piece.bitcoin_id } ellipsis={true} />
                            <hr/>
                        </div>
                    }>
                    <WalletActionPanel
                        piece={piece}
                        currentUser={currentUser}
                        loadPiece={loadPiece}
                        handleDeleteSuccess={handleDeleteSuccess}
                        submitButtonType={submitButtonType}/>
                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={piece.loan_history && piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={piece.loan_history}/>
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Notes')}
                        show={!!(currentUser.username || piece.public_note)}>
                        <Note
                            id={() => {return {'id': piece.id}; }}
                            label={getLangText('Personal note (private)')}
                            defaultValue={piece.private_note || null}
                            placeholder={getLangText('Enter your comments ...')}
                            editable={true}
                            successMessage={getLangText('Private note saved')}
                            url={ApiUrls.note_private_piece}
                            currentUser={currentUser}/>
                    </CollapsibleParagraph>
                    {children}
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
