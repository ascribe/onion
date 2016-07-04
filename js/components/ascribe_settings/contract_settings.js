'use strict';

import React from 'react';

import ContractListStore from '../../stores/contract_list_store';
import ContractListActions from '../../actions/contract_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ContractSettingsUpdateButton from './contract_settings_update_button';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import ActionPanel from '../ascribe_panel/action_panel';

import AclProxy from '../acl_proxy';
import withContext from '../context/with_context';
import { currentUserShape, whitelabelShape } from '../prop_types';

import { setDocumentTitle } from '../../utils/dom';
import { getLangText } from '../../utils/lang';
import { truncateText } from '../../utils/text';


let ContractSettings = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired,
        whitelabel: whitelabelShape.isRequired
    },

    getInitialState() {
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
                    const notification = new GlobalNotificationModel(response.notification, 'success', 4000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                })
                .catch((err) => {
                    const notification = new GlobalNotificationModel(err, 'danger', 10000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                });
        };
    },

    getPublicContracts() {
        return this.state.contractList.filter((contract) => contract.is_public);
    },

    getPrivateContracts() {
        return this.state.contractList.filter((contract) => !contract.is_public);
    },

    render() {
        const { currentUser, whitelabel } = this.props;
        const publicContracts = this.getPublicContracts();
        const privateContracts = this.getPrivateContracts();
        let createPublicContractForm = null;

        setDocumentTitle(getLangText('Contracts settings'));

        if (publicContracts.length === 0) {
            createPublicContractForm = (
                <CreateContractForm
                    fileClassToUpload={{
                        singular: 'new contract',
                        plural: 'new contracts'
                    }}
                    isPublic={true} />
            );
        }

        return (
            <div className="settings-container">
                <CollapsibleParagraph
                    title={getLangText('Contracts')}
                    defaultExpanded={true}>
                    <AclProxy
                        aclName="acl_edit_public_contract"
                        aclObject={currentUser.acl}>
                        <div>
                            {createPublicContractForm}
                            {publicContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={contract.id}
                                        title={contract.name}
                                        content={truncateText(contract.name, 120, '(...).pdf')}
                                        buttons={
                                            <div className="pull-right">
                                                <AclProxy
                                                    aclObject={whitelabel}
                                                    aclName="acl_update_public_contract">
                                                    <ContractSettingsUpdateButton contract={contract} />
                                                </AclProxy>
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
                        aclObject={currentUser.acl}>
                        <div>
                            <CreateContractForm
                                fileClassToUpload={{
                                    singular: getLangText('new contract'),
                                    plural: getLangText('new contracts')
                                }}
                                isPublic={false} />
                            {privateContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={contract.id}
                                        title={contract.name}
                                        content={truncateText(contract.name, 120, '(...).pdf')}
                                        buttons={
                                            <div className="pull-right">
                                               <AclProxy
                                                    aclObject={whitelabel}
                                                    aclName="acl_update_private_contract">
                                                    <ContractSettingsUpdateButton contract={contract} />
                                                </AclProxy>
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
                                       leftColumnWidth="60%"
                                       rightColumnWidth="40%"/>
                                );
                            })}
                        </div>
                    </AclProxy>
                </CollapsibleParagraph>
            </div>
        );
    }
});

export default withContext(ContractSettings, 'currentUser', 'whitelabel');
