'use strict';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang';

export default AclButton({
    action: 'acl_consign',
    displayName: 'ConsignButton',
    title: getLangText('Consign artwork'),
    tooltip: getLangText('Have someone else sell the artwork')
});
