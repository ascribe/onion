'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

let ShareButton = React.createClass({
    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_share'
                title={getLangText('Share artwork')}
                tooltip={getLangText('Share the artwork')} />
        );
    }
});

export default ShareButton;
