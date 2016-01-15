'use strict';

import React from 'react';
import classNames from 'classnames';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';
import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import MarketAdditionalDataForm from '../market_forms/market_additional_data_form';

import AclFormFactory from '../../../../../ascribe_forms/acl_form_factory';
import ConsignForm from '../../../../../ascribe_forms/form_consign';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import AclProxy from '../../../../../acl_proxy';
import AscribeSpinner from '../../../../../ascribe_spinner';

import ApiUrls from '../../../../../../constants/api_urls';

import { getAclFormMessage, getAclFormDataId } from '../../../../../../utils/form_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';
import { getLangText } from '../../../../../../utils/lang_utils';
import { onChangeOnce } from '../../../../../../utils/store_utils';

let MarketSubmitButton = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object,
        editions: React.PropTypes.array.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,

        className: React.PropTypes.string
    },

    // This component may eventually need to use the
    // PieceStore, but we don't need it initially
    getInitialState() {
        return mergeOptions(
            WhitelabelStore.getState(),
            {
                piece: {}
            }
        );
    },

    componentDidMount() {
        WhitelabelStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    canEditionBeSubmitted(edition) {
        if (edition && edition.extra_data && edition.other_data) {
            const { extra_data, other_data } = edition;

            if (extra_data.artist_bio && extra_data.work_description &&
                extra_data.technology_details && extra_data.display_instructions &&
                other_data.length > 0) {
                return true;
            }
        }

        return false;
    },

    getAdditionalDataForm() {
        const { piece } = this.state;

        if (piece.id) {
            return (
                <MarketAdditionalDataForm
                    extraData={piece.extra_data}
                    otherData={piece.other_data}
                    pieceId={piece.id}
                    submitLabel={getLangText('Continue to consignment')} />
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg'/>
                </div>
            );
        }
    },

    getAggregateEditionDetails() {
        const { editions } = this.props;

        // Currently, we only care if all the given editions are from the same parent piece
        // and if they can be submitted
        return editions.reduce((details, curEdition) => {
            return {
                solePieceId: details.solePieceId === curEdition.parent ? details.solePieceId : null,
                canSubmit: details.canSubmit && this.canEditionBeSubmitted(curEdition)
            };
        }, {
            solePieceId: editions.length > 0 ? editions[0].parent : null,
            canSubmit: this.canEditionBeSubmitted(editions[0])
        });
    },

    getFormDataId() {
        return getAclFormDataId(false, this.props.editions);
    },

    handleAdditionalDataSuccess(pieceId) {
        // Fetch newly updated piece to update the views
        PieceActions.fetchPiece(pieceId);

        this.refs.consignModal.show();
    },

    loadPieceIfNeeded(neededPieceId) {
        if (neededPieceId) {
            const pieceStore = PieceStore.getState();

            if (pieceStore.piece.id === neededPieceId) {
                this.setState(pieceStore);
            } else {
                onChangeOnce(this, PieceStore);
                PieceActions.fetchPiece(neededPieceId);
            }
        }
    },

    render() {
        const { availableAcls, currentUser, className, editions, handleSuccess } = this.props;
        const { whitelabel: { name: whitelabelName = 'Market', user: whitelabelAdminEmail } } = this.state;
        const { solePieceId, canSubmit } = this.getAggregateEditionDetails();
        const message = getAclFormMessage({
            aclName: 'acl_consign',
            entities: editions,
            isPiece: false,
            additionalMessage: getLangText('Suggested price:'),
            senderName: currentUser.username
        });

        const triggerButton = (
            <button
                className={classNames('btn', 'btn-default', 'btn-sm', className)}
                onClick={solePieceId && !canSubmit ? () => this.loadPieceIfNeeded(solePieceId) : () => {}}>
                {getLangText('CONSIGN TO %s', whitelabelName.toUpperCase())}
            </button>
        );
        const consignForm = (
            <AclFormFactory
                action='acl_consign'
                autoFocusProperty='message'
                email={whitelabelAdminEmail}
                message={message}
                labels={{
                    'message': getLangText('Message (also suggest a sales price if necessary)')
                }}
                pieceOrEditions={editions}
                showNotification />
        );

        if (solePieceId && !canSubmit) {
            return (
                <AclProxy
                    aclObject={availableAcls}
                    aclName='acl_consign'>
                    <ModalWrapper
                        trigger={triggerButton}
                        handleSuccess={() => this.handleAdditionalDataSuccess(solePieceId)}
                        title={getLangText('Add additional information')}>
                        {this.getAdditionalDataForm()}
                    </ModalWrapper>

                    <ModalWrapper
                        ref="consignModal"
                        handleSuccess={handleSuccess}
                        title={getLangText('Consign artwork')}>
                        {consignForm}
                    </ModalWrapper>
                </AclProxy>
            );
        } else {
            return (
                <AclProxy
                    show={availableAcls.acl_consign && canSubmit}>
                    <ModalWrapper
                        trigger={triggerButton}
                        handleSuccess={handleSuccess}
                        title={getLangText('Consign artwork to %s', whitelabelName)}>
                        {consignForm}
                    </ModalWrapper>
                </AclProxy>
            );
        }
    }
});

export default MarketSubmitButton;
