'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

export default AclButton({
    action: 'acl_share',
    displayName: 'ShareButton',
    title: getLangText('Share artwork'),
    tooltip: getLangText('Share the artwork')
});
