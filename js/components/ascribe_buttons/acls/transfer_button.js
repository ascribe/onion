'use strict';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang';

export default AclButton({
    action: 'acl_transfer',
    displayName: 'TransferButton',
    title: getLangText('Transfer artwork'),
    tooltip: getLangText('Transfer the ownership of the artwork')
});
