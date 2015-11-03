'use strict';

import React from 'react';

import AclButton from './acl_button';

import { omitFromObject } from '../../../utils/general_utils';
import { getLangText } from '../../../utils/lang_utils';

let TransferButton = React.createClass({
    propTypes: omitFromObject(AclButton.propTypes, ['action']),

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
