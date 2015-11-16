'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

export default AclButton({
    action: 'acl_share',
    displayName: 'EmailButton',
    title: getLangText('Share artwork via email'),
    tooltip: getLangText("Share the artwork to another user's collection through email")
});
