'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

export default AclButton({
    action: 'acl_transfer',
    displayName: 'TransferButton',
    title: getLangText('Transfer artwork'),
    tooltip: getLangText('Transfer the ownership of the artwork')
});
