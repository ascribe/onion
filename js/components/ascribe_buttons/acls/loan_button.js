'use strict';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang';

export default AclButton({
    action: 'acl_loan',
    displayName: 'LoanButton',
    title: getLangText('Loan artwork'),
    tooltip: getLangText('Loan your artwork for a limited period of time')
});
