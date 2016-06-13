'use strict';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang';

export default AclButton({
    action: 'acl_unconsign',
    displayName: 'UnconsignButton',
    title: getLangText('Unconsign artwork'),
    tooltip: getLangText('Have the owner manage his sales again')
});
