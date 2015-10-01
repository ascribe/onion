'use strict';

import React from 'react';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';
import CreateContractForm from '../ascribe_forms/form_create_contract';

import ContractListStore from '../../stores/contract_list_store';
import ContractListActions from '../../actions/contract_list_actions';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import WhitelabelStore from '../../stores/whitelabel_store';
import WhitelabelActions from '../../actions/whitelabel_actions';

import ActionPanel from '../ascribe_panel/action_panel';
import ContractSettingsUpdateButton from './contract_settings_update_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AclProxy from '../acl_proxy';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions, truncateTextAtCharIndex } from '../../utils/general_utils';


let ContractSettings = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState(){
        return mergeOptions(
            ContractListStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        ContractListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
        UserActions.fetchCurrentUser();
        ContractListActions.fetchContractList(true);
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
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
                    }}
                    location={this.props.location}/>
            );
        }

        return (
            <div className="settings-container">
                <CollapsibleParagraph
                    title={getLangText('Contracts')}
                    defaultExpanded={true}>
                    <AclProxy
                        aclName="acl_edit_public_contract"
                        aclObject={this.state.currentUser.acl}>
                        <div>
                            {createPublicContractForm}
                            {publicContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={i}
                                        title={contract.name}
                                        content={truncateTextAtCharIndex(contract.name, 120, '(...).pdf')}
                                        buttons={
                                            <div className="pull-right">
                                                <AclProxy
                                                    aclObject={this.state.whitelabel}
                                                    aclName="acl_update_public_contract">
                                                    <ContractSettingsUpdateButton
                                                        contract={contract}
                                                        location={this.props.location}/>
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
                        aclObject={this.state.currentUser.acl}>
                        <div>
                            <CreateContractForm
                            isPublic={false}
                            fileClassToUpload={{
                                singular: getLangText('new contract'),
                                plural: getLangText('new contracts')
                            }}
                            location={this.props.location}/>
                            {privateContracts.map((contract, i) => {
                                return (
                                    <ActionPanel
                                        key={i}
                                        title={contract.name}
                                        content={truncateTextAtCharIndex(contract.name, 120, '(...).pdf')}
                                        buttons={
                                            <div className="pull-right">
                                               <AclProxy
                                                    aclObject={this.state.whitelabel}
                                                    aclName="acl_update_private_contract">
                                                    <ContractSettingsUpdateButton
                                                        contract={contract}
                                                        location={this.props.location}/>
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

export default ContractSettings;