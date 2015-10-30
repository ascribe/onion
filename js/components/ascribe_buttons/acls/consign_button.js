'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

let ConsignButton = React.createClass({
    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_consign'
                title={getLangText('Consign artwork')}
                tooltip={getLangText('Have someone else sell the artwork')} />
        );
    }
});

export default ConsignButton;
