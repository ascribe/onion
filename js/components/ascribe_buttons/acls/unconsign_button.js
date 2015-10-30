'use strict';

import React from 'react';

import AclButton from './acl_button';

import { getLangText } from '../../../utils/lang_utils';

let UnconsignButton = React.createClass({
    render() {
        return (
            <AclButton
                {...this.props}
                action='acl_unconsign'
                title={getLangText('Unconsign artwork')}
                tooltip={getLangText('Have the owner manage his sales again')} />
        );
    }
});

export default UnconsignButton;
