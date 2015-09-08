'use strict';

import React from 'react';

import ContractListActions from '../../actions/contract_list_actions';
import ContractListStore from '../../stores/contract_list_store';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';
import PropertyCollapsible from './property_collapsible';
import InputTextAreaToggable from './input_textarea_toggable';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


let ContractAgreementForm = React.createClass({
     propTypes: {
        handleSuccess: React.PropTypes.func
     },

     getInitialState() {
        return mergeOptions(
            ContractListStore.getState(),
            {
                selectedContract: 0
            }
        );
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

    onContractChange(event){
        this.setState({selectedContract: event.target.selectedIndex});
    },

    handleSubmitSuccess(response) {
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormData(){
        return {'appendix': {'default': this.refs.form.refs.appendix.state.value},
                'contract': this.state.contractList[this.state.selectedContract].id};
    },

    getContracts() {
        if (this.state.contractList && this.state.contractList.length > 0) {
            let contractList = this.state.contractList;
            console.log(contractList)
            return (
                <Property
                    name='contract'
                    label={getLangText('Contract Type')}
                    onChange={this.onContractChange}
                    footer={
                        <a
                            className="pull-right"
                            href={contractList[this.state.selectedContract].blob}
                            target="_blank">
                            {getLangText('Learn more')}
                        </a>
                    }>
                    <select name="contract">
                        {contractList.map((contract, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ contract.id }>
                                    { contract.name }
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        }
        return null;
    },

    render() {
        return (
            <Form
                className="ascribe-form-bordered ascribe-form-wrapper"
                ref='form'
                url={ApiUrls.ownership_contract_agreements}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                buttons={<button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login">
                            {getLangText('Send loan request')}
                        </button>}
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>{getLangText('Contract form')}</h3>
                </div>
                <Property
                    name='signee'
                    label={getLangText('Artist Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('(e.g. andy@warhol.co.uk)')}
                        required/>
                </Property>
                {this.getContracts()}
                <PropertyCollapsible
                    name='appendix'
                    checkboxLabel={getLangText('Add appendix to the contract')}>
                    <span>{getLangText('Appendix')}</span>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('This will be appended to the contract selected above')}/>
                </PropertyCollapsible>
            </Form>
        );
    }
});

export default ContractAgreementForm;