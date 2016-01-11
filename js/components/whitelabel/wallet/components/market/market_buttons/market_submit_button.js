'use strict';

import React from 'react';
import classNames from 'classnames';

import PieceActions from '../../../../../../actions/piece_actions';

import MarketAdditionalDataForm from '../market_forms/market_additional_data_form';

import AclFormFactory from '../../../../../ascribe_forms/acl_form_factory';
import ConsignForm from '../../../../../ascribe_forms/form_consign';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import AclProxy from '../../../../../acl_proxy';

import ApiUrls from '../../../../../../constants/api_urls';

import { getAclFormMessage, getAclFormDataId } from '../../../../../../utils/form_utils';
import { getLangText } from '../../../../../../utils/lang_utils';

let MarketSubmitButton = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        editions: React.PropTypes.array.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        className: React.PropTypes.string,
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

    getFormDataId() {
        return getAclFormDataId(false, this.props.editions);
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

    handleAdditionalDataSuccess(pieceId) {
        // Fetch newly updated piece to update the views
        PieceActions.fetchOne(pieceId);

        this.refs.consignModal.show();
    },

    render() {
        const {
            availableAcls,
            currentUser,
            className,
            editions,
            handleSuccess,
            whitelabel: { name: whitelabelName = 'Market', user: whitelabelAdminEmail } } = this.props;

        const { solePieceId, canSubmit } = this.getAggregateEditionDetails();
        const message = getAclFormMessage({
            aclName: 'acl_consign',
            entities: editions,
            isPiece: false,
            additionalMessage: getLangText('Suggested price:'),
            senderName: currentUser.username
        });

        const triggerButton = (
            <button className={classNames('btn', 'btn-default', 'btn-sm', className)}>
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
                        handleSuccess={this.handleAdditionalDataSuccess.bind(this, solePieceId)}
                        title={getLangText('Add additional information')}>
                        <MarketAdditionalDataForm
                            pieceId={solePieceId}
                            submitLabel={getLangText('Continue to consignment')} />
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
