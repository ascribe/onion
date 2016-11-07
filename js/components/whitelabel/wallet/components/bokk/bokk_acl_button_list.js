'use strict';

import React from 'react';

import AclButton from '../../../../ascribe_buttons/acls/acl_button';
import DeleteButton from '../../../../ascribe_buttons/delete_button';
import EmailButton from '../../../../ascribe_buttons/acls/email_button';

import { selectFromObject } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let BokkAclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        pieceOrEditions: React.PropTypes.array.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        className: React.PropTypes.string
    },

    render() {
        const { availableAcls,
                children,
                className,
                currentUser,
                handleSuccess,
                pieceOrEditions,
                whitelabel } = this.props;

        const buttonProps = selectFromObject(this.props, [
            'availableAcls',
            'currentUser',
            'handleSuccess',
            'pieceOrEditions'
        ]);

        let BokkButton = AclButton({
            action: 'acl_loan',
            displayName: 'LoanButton',
            title: getLangText('Partager avec Bokk')
        })

        return (
            <div className={className}>
                <EmailButton {...buttonProps} />
                <DeleteButton {...buttonProps} />
                <BokkButton buttonAcceptName='PARTAGER AVEC BOKK' {...buttonProps} />
                {children}
            </div>
        );
    }
});

export default BokkAclButtonList;
