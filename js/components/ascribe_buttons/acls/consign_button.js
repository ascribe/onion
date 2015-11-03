'use strict';

import React from 'react';

import AclButton from './acl_button';

import { omitFromObject } from '../../../utils/general_utils';
import { getLangText } from '../../../utils/lang_utils';

let ConsignButton = React.createClass({
    propTypes: {
        ...omitFromObject(AclButton.propTypes, ['action']),
        email: React.PropTypes.string
    },

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
