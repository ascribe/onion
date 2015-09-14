'use strict';

import React from 'react';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import ContractListStore from '../../stores/contract_list_store';
import ContractListActions from '../../actions/contract_list_actions';

import ActionPanel from '../ascribe_panel/action_panel';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

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
        ContractListActions.fetchContractList({is_active: 'True'});
    },

    componentWillUnmount() {
        ContractListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    makeContractPublic(contract) {
        return () => {
            contract.is_public = true;
            ContractListActions.changeContract(contract)
                .then(() => {
                    ContractListActions.fetchContractList({is_active: 'True'});
                    let notification = getLangText('Contract %s is now public', contract.name);
                    notification = new GlobalNotificationModel(notification, 'success', 4000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                })
                .catch((err) => {
                    let notification = new GlobalNotificationModel(err, 'danger', 10000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                });
        };
    },

    removeContract(contract) {
        return () => {
            ContractListActions.removeContract(contract.id)
                .then((response) => {
                    ContractListActions.fetchContractList({is_active: 'True'});
                    let notification = new GlobalNotificationModel(response.notification, 'success', 4000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                })
                .catch((err) => {
                    let notification = new GlobalNotificationModel(err, 'danger', 10000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                });
        };
    },

    getPublicContracts(){
        return this.state.contractList.filter((contract) => contract.is_public);
    },

    getPrivateContracts(){
        return this.state.contractList.filter((contract) => !contract.is_public);
    },

    render() {
        let publicContracts = this.getPublicContracts();
        let privateContracts = this.getPrivateContracts();
        let createPublicContractForm = null;

        if(publicContracts.length === 0) {
            createPublicContractForm = (
                <CreateContractForm
                    isPublic={true}
                    fileClassToUpload={{
                        singular: 'new public contract',
                        plural: 'new public contracts'
                    }}/>
            );
        }

        return (
            <CollapsibleParagraph
                title={getLangText('Contract Settings')}
                show={true}
                defaultExpanded={true}>
                <CollapsibleParagraph
                    title={getLangText('List Contracts')}
                    show={true}
                    defaultExpanded={true}>
                    <CollapsibleParagraph
                        title={getLangText('Public Contracts')}
                        show={true}
                        defaultExpanded={true}>
                        {createPublicContractForm}
                        {publicContracts.map((contract, i) => {
                            return (
                                <ActionPanel
                                    key={i}
                                    title={contract.name}
                                    content={contract.name}
                                    buttons={
                                        <div className="pull-right">
                                           <button className="btn btn-default btn-sm margin-left-2px">
                                                UPDATE
                                           </button>
                                           <a
                                                className="btn btn-default btn-sm margin-left-2px"
                                                href={contract.blob.url_safe}
                                                target="_blank">
                                                PREVIEW
                                           </a>
                                           <button
                                                className="btn btn-default btn-sm margin-left-2px"
                                                onClick={this.removeContract(contract)}>
                                                REMOVE
                                            </button>
                                       </div>
                                    }
                                    leftColumnWidth="40%"
                                    rightColumnWidth="60%"/>
                            );
                        })}
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Private Contracts')}
                        show={true}
                        defaultExpanded={true}>
                        <CreateContractForm
                            isPublic={false}
                            fileClassToUpload={{
                                singular: 'new private contract',
                                plural: 'new private contracts'
                            }}/>
                        {privateContracts.map((contract, i) => {
                            return (
                                <ActionPanel
                                    key={i}
                                    title={contract.name}
                                    content={contract.name}
                                    buttons={
                                        <div className="pull-right">
                                            <button
                                                className="btn btn-default btn-sm margin-left-2px"
                                                onClick={this.makeContractPublic(contract)}>
                                                MAKE PUBLIC
                                            </button>
                                           <button className="btn btn-default btn-sm margin-left-2px">
                                                UPDATE
                                            </button>
                                            <a
                                                className="btn btn-default btn-sm margin-left-2px"
                                                href={contract.blob.url_safe}
                                                target="_blank">
                                                PREVIEW
                                           </a>
                                            <button
                                                className="btn btn-default btn-sm margin-left-2px"
                                                onClick={this.removeContract(contract)}>
                                                REMOVE
                                            </button>
                                       </div>
                                   }
                                   leftColumnWidth="40%"
                                   rightColumnWidth="60%"/>
                            );
                        })}
                    </CollapsibleParagraph>
                </CollapsibleParagraph>
            </CollapsibleParagraph>
        );
    }
});

export default ContractSettings;