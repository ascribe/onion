'use strict';

import React from 'react';

import Property from '../../../../../ascribe_forms/property';

import LoanContractListActions from '../../../../../../actions/loan_contract_list_actions';
import LoanContractListStore from '../../../../../../stores/loan_contract_list_store';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import Form from '../../../../../ascribe_forms/form';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let ContractForm = React.createClass({
     getInitialState() {
        return mergeOptions(
            LoanContractListStore.getState(),
            {
                selectedContract: 0
            }
        );
    },

    componentDidMount() {
        LoanContractListStore.listen(this.onChange);
        LoanContractListActions.fetchLoanContractList();
    },

    componentWillUnmount() {
        LoanContractListStore.unlisten(this.onChange);
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

    getContracts() {
        if (this.state.contractList && this.state.contractList.length > 0) {
            return (
                <Property
                    name='contract'
                    label={getLangText('Contract Type')}
                    onChange={this.onContractChange}
                    footer={
                        <a
                            className="pull-right"
                            href={this.state.contractList[this.state.selectedContract].s3UrlSafe}
                            target="_blank">
                            {getLangText('Learn more')}
                        </a>
                    }>
                    <select name="contract">
                        {this.state.contractList.map((contract, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ contract.name }>
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
                url={ApiUrls.ownership_loans_contract}
                handleSuccess={this.props.handleSuccess}
                buttons={<button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login">
                            SEND LOAN REQUEST
                        </button>}
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>CONTRACT FORM</h3>
                </div>
                <Property
                    name='artist_name'
                    label={getLangText('Artist Name')}>
                    <input
                        type="text"
                        placeholder="(e.g. Andy Warhol)"
                        required/>
                </Property>
                <Property
                    name='artist_email'
                    label={getLangText('Artist Email')}>
                    <input
                        type="email"
                        placeholder="(e.g. andy@warhol.co.uk)"
                        required/>
                </Property>
                {this.getContracts()}
                <Property
                    name='appendix'
                    label={getLangText('Appendix')}>
                    <input
                        type="text"
                        placeholder="Add an appendix to the contract"
                        required/>
                </Property>
            </Form>
        );
    }
});

export default ContractForm;