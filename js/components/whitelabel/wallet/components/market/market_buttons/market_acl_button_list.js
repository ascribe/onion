'use strict';

import React from 'react';

import MarketSubmitButton from './market_submit_button';

import DeleteButton from '../../../../../ascribe_buttons/delete_button';
import EmailButton from '../../../../../ascribe_buttons/acls/email_button';
import TransferButton from '../../../../../ascribe_buttons/acls/transfer_button';
import UnconsignButton from '../../../../../ascribe_buttons/acls/unconsign_button';

import { selectFromObject } from '../../../../../../utils/general_utils';

let MarketAclButtonList = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
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
                handleSuccess,
                pieceOrEditions,
                whitelabel } = this.props;

        const buttonProps = selectFromObject(this.props, [
            'availableAcls',
            'handleSuccess',
            'pieceOrEditions'
        ]);

        return (
            <div className={className}>
                <MarketSubmitButton
                    availableAcls={availableAcls}
                    editions={pieceOrEditions}
                    handleSuccess={handleSuccess}
                    whitelabel={whitelabel} />
                <EmailButton {...buttonProps} />
                <TransferButton {...buttonProps} />
                <UnconsignButton {...buttonProps} />
                {children}
            </div>
        );
    }
});

export default MarketAclButtonList;
