'use strict';

import React from 'react';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import ContractListStore from '../../stores/contract_list_store';
import ContractListActions from '../../actions/contract_list_actions';

import ActionPanel from '../ascribe_panel/action_panel';
import ContractSettingsUpdateButton from './contract_settings_update_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AclProxy from '../acl_proxy';

import { getLangText } from '../../utils/lang_utils';


let ContractSettings = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object,
        defaultExpanded: React.PropTypes.bool
    },

    getInitialState(){
        return ContractListStore.getState();
    },

    componentDidMount() {
        ContractListStore.listen(this.onChange);
        ContractListActions.fetchContractList(true);
    },

    componentWillUnmount() {
        ContractListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    removeContract(contract) {
        return () => {
            ContractListActions.removeContract(contract.id)
                .then((response) => {
                    ContractListActions.fetchContractList(true);
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
                        singular: 'new contract',
                        plural: 'new contracts'
                    }}/>
            );
        }

        return (
            <AclProxy
                aclName="acl_view_contract_settings"
                aclObject={this.props.currentUser.acl}>
                <CollapsibleParagraph
                    title={getLangText('Contracts')}
                    show={true}
                    defaultExpanded={false}>
                    <AclProxy
                        aclName="acl_edit_public_contract"
                        aclObject={this.props.currentUser.acl}>
                        <div>
                            {createPublicContractForm}
                            {publicContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={i}
                                        title={contract.name}
                                        content={contract.name}
                                        buttons={
                                            <div className="pull-right">
                                                <ContractSettingsUpdateButton contract={contract}/>
                                                <a
                                                    className="btn btn-default btn-sm margin-left-2px"
                                                    href={contract.blob.url_safe}
                                                    target="_blank">
                                                    {getLangText('PREVIEW')}
                                                </a>
                                                <button
                                                    className="btn btn-danger btn-sm margin-left-2px"
                                                    onClick={this.removeContract(contract)}>
                                                    {getLangText('REMOVE')}
                                                </button>
                                           </div>
                                        }
                                        leftColumnWidth="40%"
                                        rightColumnWidth="60%"/>
                                );
                            })}
                        </div>
                    </AclProxy>
                    <AclProxy
                        aclName="acl_edit_private_contract"
                        aclObject={this.props.currentUser.acl}>
                        <div>
                            <CreateContractForm
                            isPublic={false}
                            fileClassToUpload={{
                                singular: getLangText('new contract'),
                                plural: getLangText('new contracts')
                            }}/>
                            {privateContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={i}
                                        title={contract.name}
                                        content={contract.name}
                                        buttons={
                                            <div className="pull-right">
                                               <ContractSettingsUpdateButton contract={contract} />
                                                <a
                                                    className="btn btn-default btn-sm margin-left-2px"
                                                    href={contract.blob.url_safe}
                                                    target="_blank">
                                                    {getLangText('PREVIEW')}
                                               </a>
                                                <button
                                                    className="btn btn-danger btn-sm margin-left-2px"
                                                    onClick={this.removeContract(contract)}>
                                                    {getLangText('REMOVE')}
                                                </button>
                                           </div>
                                       }
                                       leftColumnWidth="40%"
                                       rightColumnWidth="60%"/>
                                );
                            })}
                        </div>
                    </AclProxy>
                </CollapsibleParagraph>
            </AclProxy>
        );
    }
});

export default ContractSettings;