'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

let TransferButton = React.createClass({
    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_transfer'
                title={getLangText('Transfer artwork')}
                tooltip={getLangText('Transfer the ownership of the artwork')} />
        );
    }
});

export default TransferButton;
