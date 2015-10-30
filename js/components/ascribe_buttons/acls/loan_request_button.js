'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

let LoanButton = React.createClass({
    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_loan_request'
                title={getLangText('Loan artwork')}
                tooltip={getLangText('Someone requested you to loan your artwork for a limited period of time')} />
        );
    }
});

export default LoanButton;
