'use strict';

import React from 'react';

import AclButton from './acl_button';

import { omitFromObject } from '../../../utils/general_utils';
import { getLangText } from '../../../utils/lang_utils';

let LoanButton = React.createClass({
    propTypes: {
        ...omitFromObject(AclButton.propTypes, ['action']),
        email: React.PropTypes.string
    },

    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_loan'
                title={getLangText('Loan artwork')}
                tooltip={getLangText('Loan your artwork for a limited period of time')} />
        );
    }
});

export default LoanButton;
