'use strict';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang';

export default AclButton({
    action: 'acl_loan_request',
    displayName: 'LoanRequestButton',
    title: getLangText('Loan artwork'),
    tooltip: getLangText('Someone requested you to loan your artwork for a limited period of time')
});
