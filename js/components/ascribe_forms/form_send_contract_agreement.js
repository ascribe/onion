'use strict';

import React from 'react';
import { History } from 'react-router';

import ContractListActions from '../../actions/contract_list_actions';
import ContractListStore from '../../stores/contract_list_store';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


let SendContractAgreementForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func
    },

    mixins: [History],

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
        ContractListActions.fetchContractList(true, false);
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

    handleSubmitSuccess() {
        let notification = 'Contract agreement sent';
        notification = new GlobalNotificationModel(notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.history.push('/collection');
    },

    getFormData() {
        const appendixValue = this.refs.form.refs.appendix.state.value;

        if (appendixValue) {
            return { 'appendix': { 'default': appendixValue } };
        }
    },

    getContracts() {
        if (this.state.contractList && this.state.contractList.length > 0) {
            let contractList = this.state.contractList;
            return (
                <Property
                    name='contract'
                    label={getLangText('Contract Type')}
                    onChange={this.onContractChange}>
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
        if (this.state.contractList && this.state.contractList.length > 0) {
            return (
                <Form
                    className="ascribe-form-bordered ascribe-form-wrapper"
                    ref='form'
                    url={ApiUrls.ownership_contract_agreements}
                    getFormData={this.getFormData}
                    handleSuccess={this.handleSubmitSuccess}
                    buttons={<button
                                type="submit"
                                className="btn btn-default btn-wide">
                                {getLangText('Send contract')}
                            </button>}
                    spinner={
                        <span className="btn btn-default btn-wide btn-spinner">
                            <AscribeSpinner color="dark-blue" size="md" />
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
                    <Property
                        name='appendix'
                        checkboxLabel={getLangText('Add appendix to the contract')}
                        expanded={false}
                        style={{paddingBottom: 0}}>
                        <span>{getLangText('Appendix')}</span>
                        {/* We're using disabled on a form here as PropertyCollapsible currently
                        does not support the disabled + overrideForm functionality */}
                        <InputTextAreaToggable
                            rows={1}
                            disabled={false}
                            placeholder={getLangText('This will be appended to the contract selected above')}/>
                    </Property>
                </Form>
            );
        }
        return (
            <div>
                <p className="text-center">
                    {getLangText('No contracts uploaded yet, please go to the ')}
                    <a href="contract_settings">{getLangText('contract settings page')}</a>
                    {getLangText(' and create them.')}
                </p>
            </div>
        );
    }
});

export default SendContractAgreementForm;
