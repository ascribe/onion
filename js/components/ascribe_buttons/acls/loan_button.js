'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

export default AclButton({
    action: 'acl_loan',
    displayName: 'LoanButton',
    title: getLangText('Loan artwork'),
    tooltip: getLangText('Loan your artwork for a limited period of time')
});
