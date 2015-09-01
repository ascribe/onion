'use strict';

import React from 'react';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import { getLangText } from '../../utils/lang_utils';


let ContractSettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('Contract Settings')}
                show={true}
                defaultExpanded={true}>
                {/* this should be this.props.defaultExpanded */}
                <CreateContractForm />
            </CollapsibleParagraph>
        );
    }
});

export default ContractSettings;