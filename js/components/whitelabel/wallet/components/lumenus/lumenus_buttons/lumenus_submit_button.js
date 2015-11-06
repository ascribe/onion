'use strict';

import React from 'react';
import classNames from 'classnames';

import LumenusAdditionalDataForm from '../lumenus_forms/lumenus_additional_data_form';

import ConsignButton from '../../../../../ascribe_buttons/acls/consign_button';

import AclFormFactory from '../../../../../ascribe_forms/acl_form_factory';
import ConsignForm from '../../../../../ascribe_forms/form_consign';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import AclProxy from '../../../../../acl_proxy';

import PieceActions from '../../../../../../actions/piece_actions';
import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import ApiUrls from '../../../../../../constants/api_urls';

import { getAclFormDataId } from '../../../../../../utils/form_utils';
import { getLangText } from '../../../../../../utils/lang_utils';

let LumenusSubmitButton = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        editions: React.PropTypes.array.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
    },

    getInitialState() {
        return WhitelabelStore.getState();
    },

    componentDidMount() {
        WhitelabelStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
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
        const { availableAcls, currentUser, className, editions, handleSuccess } = this.props;
        const buttonTitle = getLangText('CONSIGN TO LUMENUS');

        const { solePieceId, canSubmit } = this.getAggregateEditionDetails();

        if (solePieceId && !canSubmit) {
            return (
                <AclProxy
                    aclObject={availableAcls}
                    aclName='acl_consign'>
                    <ModalWrapper
                        trigger={
                            <button className={classNames('btn', 'btn-default', 'btn-sm', className)}>
                                {buttonTitle}
                            </button>
                        }
                        handleSuccess={this.handleAdditionalDataSuccess.bind(this, solePieceId)}
                        title={getLangText('Add additional information')}>
                        <LumenusAdditionalDataForm
                            pieceId={solePieceId} />
                    </ModalWrapper>

                    <ModalWrapper
                        ref="consignModal"
                        handleSuccess={handleSuccess}
                        title={getLangText('Consign artwork')}>
                        <AclFormFactory
                            action='acl_consign'
                            currentUser={currentUser}
                            email={this.state.whitelabel.user}
                            pieceOrEditions={editions}
                            showNotification />
                    </ModalWrapper>
                </AclProxy>
            );
        } else {
            return (
                <ConsignButton
                    availableAcls={{'acl_consign': availableAcls.acl_consign && canSubmit}}
                    buttonAcceptName={buttonTitle}
                    email={this.state.whitelabel.user}
                    currentUser={currentUser}
                    handleSuccess={handleSuccess}
                    pieceOrEditions={editions}
                    className={className} />
            );
        }
    }
});

export default LumenusSubmitButton;
