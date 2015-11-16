'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

export default AclButton({
    action: 'acl_unconsign',
    displayName: 'UnconsignButton',
    title: getLangText('Unconsign artwork'),
    tooltip: getLangText('Have the owner manage his sales again')
});
