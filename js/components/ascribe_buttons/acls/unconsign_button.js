'use strict';

import React from 'react';

import AclButton from './acl_button';

import { omitFromObject } from '../../../utils/general_utils';
import { getLangText } from '../../../utils/lang_utils';

let UnconsignButton = React.createClass({
    propTypes: omitFromObject(AclButton.propTypes, ['action']),

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
