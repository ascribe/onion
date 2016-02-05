'use strict';

import React from 'react';
import classNames from 'classnames';

import EditionActions from '../../../../../../actions/edition_actions';

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
        whitelabel: React.PropTypes.object.isRequired,

        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
    },

    canEditionBeSubmitted(edition) {
        if (edition && edition.extra_data && edition.other_data) {
            const {
                extra_data: {
                    artist_bio: artistBio,
                    display_instructions: displayInstructions,
                    technology_details: technologyDetails,
                    work_description: workDescription
                },
                other_data: otherData } = edition;

            return artistBio && displayInstructions && technologyDetails && workDescription && otherData.length;
        }

        return false;
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

    handleAdditionalDataSuccess() {
        this.refs.consignModal.show();
    },

    refreshEdition() {
        if (this.props.editions.length === 1) {
            EditionActions.fetchEdition(this.props.editions[0].bitcoin_id);
        }
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

        // If only a single piece is selected, all the edition's extra_data and other_data will
        // be the same, so we just take the first edition's
        const { extra_data: extraData, other_data: otherData } = solePieceId ? editions[0] : {};

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
                        handleSuccess={this.handleAdditionalDataSuccess}
                        title={getLangText('Add additional information')}>
                        <MarketAdditionalDataForm
                            extraData={extraData}
                            otherData={otherData}
                            pieceId={solePieceId}
                            submitLabel={getLangText('Continue to consignment')} />
                    </ModalWrapper>

                    <ModalWrapper
                        ref="consignModal"
                        handleCancel={this.refreshEdition}
                        handleSuccess={(...params) => {
                            if (typeof handleSuccess === 'function') {
                                handleSuccess(...params);
                            }

                            this.refreshEdition();
                        }}
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
