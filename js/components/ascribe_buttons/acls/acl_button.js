'use strict';

import React from 'react';
import classNames from 'classnames';

import AclProxy from '../../acl_proxy';

import AclFormFactory from '../../ascribe_forms/acl_form_factory';

import ModalWrapper from '../../ascribe_modal/modal_wrapper';

import AppConstants from '../../../constants/application_constants';

import { AclInformationText } from '../../../constants/acl_information_text';


export default function AclButton({ action, displayName, title, tooltip }) {
    if (AppConstants.aclList.indexOf(action) < 0) {
        console.warn('Your specified aclName did not match a an acl class.');
    }

    return React.createClass({
        displayName: displayName,

        propTypes: {
            availableAcls: React.PropTypes.object.isRequired,
            handleSuccess: React.PropTypes.func.isRequired,

            buttonAcceptName: React.PropTypes.string,
            buttonAcceptClassName: React.PropTypes.string,
            currentUser: React.PropTypes.object,
            email: React.PropTypes.string,
            pieceOrEditions: React.PropTypes.oneOfType([
                React.PropTypes.object,
                React.PropTypes.array
            ]).isRequired,
            className: React.PropTypes.string
        },

        sanitizeAction() {
            const { buttonAcceptName } = this.props;

            return buttonAcceptName || AclInformationText.titles[action];
        },

        render() {
            const {
                availableAcls,
                buttonAcceptClassName,
                currentUser,
                email,
                pieceOrEditions,
                handleSuccess } = this.props;

            return (
                <AclProxy
                    aclName={action}
                    aclObject={availableAcls}>
                    <ModalWrapper
                        trigger={
                            <button
                                className={classNames('btn', 'btn-default', 'btn-sm', buttonAcceptClassName)}>
                                {this.sanitizeAction()}
                            </button>
                        }
                        handleSuccess={handleSuccess}
                        title={title}>
                        <AclFormFactory
                            action={action}
                            currentUser={currentUser}
                            email={email}
                            pieceOrEditions={pieceOrEditions}
                            showNotification />
                    </ModalWrapper>
                </AclProxy>
            );
        }
    });
}
