'use strict';

import React from 'react';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import ContractListStore from '../../stores/contract_list_store';
import ContractListActions from '../../actions/contract_list_actions';

import { getLangText } from '../../utils/lang_utils';

let ContractSettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },
    getInitialState(){
        return ContractListStore.getState();
    },
    componentDidMount() {
        ContractListStore.listen(this.onChange);
        ContractListActions.fetchContractList();
    },
    componentWillUnmount() {
        ContractListStore.unlisten(this.onChange);
    },
    onChange(state) {
        this.setState(state);
    },
    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('Contract Settings')}
                show={true}
                defaultExpanded={true}>
                {/* this should be this.props.defaultExpanded */}
                <CollapsibleParagraph
                    title={getLangText('List Contracts')}
                    show={true}
                    defaultExpanded={true}>
                    {this.state.contractList}
                </CollapsibleParagraph>
                <CollapsibleParagraph
                    title={getLangText('Create Contract')}
                    show={true}
                    defaultExpanded={true}>
                    <CreateContractForm />
                </CollapsibleParagraph>
            </CollapsibleParagraph>
        );
    }
});

export default ContractSettings;