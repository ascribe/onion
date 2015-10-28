'use strict';

import React from 'react';

import classnames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import InputDate from './input_date';
import InputCheckbox from './input_checkbox';

import ContractAgreementListStore from '../../stores/contract_agreement_list_store';
import ContractAgreementListActions from '../../actions/contract_agreement_list_actions';

import AscribeSpinner from '../ascribe_spinner';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';
import AclInformation from '../ascribe_buttons/acl_information';

let LoanForm = React.createClass({
    propTypes: {
        loanHeading: React.PropTypes.string,
        email: React.PropTypes.string,
        gallery: React.PropTypes.string,
        startdate: React.PropTypes.object,
        enddate: React.PropTypes.object,
        showPersonalMessage: React.PropTypes.bool,
        showEndDate: React.PropTypes.bool,
        showStartDate: React.PropTypes.bool,
        showPassword: React.PropTypes.bool,
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        createPublicContractAgreement: React.PropTypes.bool,
        handleSuccess: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            loanHeading: '',
            showPersonalMessage: true,
            showEndDate: true,
            showStartDate: true,
            showPassword: true,
            createPublicContractAgreement: true
        };
    },

    getInitialState() {
        return ContractAgreementListStore.getState();
    },

    componentDidMount() {
        ContractAgreementListStore.listen(this.onChange);
        this.getContractAgreementsOrCreatePublic(this.props.email);
    },

    /**
     * This method needs to be in form_loan as some whitelabel pages (Cyland) load
     * the loanee's email async!
     *
     * SO LEAVE IT IN!
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.email && this.props.email !== nextProps.email) {
            this.getContractAgreementsOrCreatePublic(nextProps.email);
        }
    },

    componentWillUnmount() {
        ContractAgreementListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getContractAgreementsOrCreatePublic(email){
        ContractAgreementListActions.flushContractAgreementList.defer();
        if (email) {
            // fetch the available contractagreements (pending/accepted)
            ContractAgreementListActions.fetchAvailableContractAgreementList(email, true);
        }
    },

    getFormData(){
        return mergeOptions(
            this.props.id,
            this.getContractAgreementId()
        );
    },

    handleOnChange(event) {
        // event.target.value is the submitted email of the loanee
        if(event && event.target && event.target.value && event.target.value.match(/.*@.*\..*/)) {
            this.getContractAgreementsOrCreatePublic(event.target.value);
        } else {
            ContractAgreementListActions.flushContractAgreementList();
        }
    },

    getContractAgreementId() {
        if (this.state.contractAgreementList && this.state.contractAgreementList.length > 0) {
            return {'contract_agreement_id': this.state.contractAgreementList[0].id};
        }
        return {};
    },

    getContractCheckbox() {
        if(this.state.contractAgreementList && this.state.contractAgreementList.length > 0) {
            // we need to define a key on the InputCheckboxes as otherwise
            // react is not rerendering them on a store switch and is keeping
            // the default value of the component (which is in that case true)
            let contractAgreement = this.state.contractAgreementList[0];
            let contract = contractAgreement.contract;

            if(contractAgreement.datetime_accepted) {
                return (
                    <Property
                        name="terms"
                        label={getLangText('Loan Contract')}
                        hidden={false}
                        className="notification-contract-pdf">
                        <embed
                            className="loan-form"
                            src={contract.blob.url_safe}
                            alt="pdf"
                            pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                        <a href={contract.blob.url_safe} target="_blank">
                            <span className="glyphicon glyphicon-download" aria-hidden="true"></span> {getLangText('Download contract')}
                        </a>
                        {/* We still need to send the server information that we're accepting */}
                        <InputCheckbox
                                style={{'display': 'none'}}
                                key="terms_implicitly"
                                defaultChecked={true} />
                    </Property>
                );
            } else {
                return (
                    <Property
                        name="terms"
                        className="ascribe-property-collapsible-toggle"
                        style={{paddingBottom: 0}}>
                        <InputCheckbox
                            key="terms_explicitly"
                            defaultChecked={false}>
                            <span>
                                {getLangText('I agree to the')}&nbsp;
                                <a href={contract.blob.url_safe} target="_blank">
                                    {getLangText('terms of ')} {contract.issuer}
                                </a>
                            </span>
                        </InputCheckbox>
                    </Property>
                );
            }
        } else {
            return (
                <Property
                    name="terms"
                    style={{paddingBottom: 0}}
                    hidden={true}>
                    <InputCheckbox
                        key="terms_implicitly"
                        defaultChecked={true} />
                </Property>
            );
        }
    },

    getAppendix() {
        if(this.state.contractAgreementList && this.state.contractAgreementList.length > 0) {
            let appendix = this.state.contractAgreementList[0].appendix;
            if (appendix && appendix.default) {
                return (
                    <Property
                        name='appendix'
                        label={getLangText('Appendix')}>
                        <pre className="ascribe-pre">{appendix.default}</pre>
                    </Property>
                );
            }
        }
        return null;
    },

    getButtons() {
        if(this.props.loanHeading) {
            return (
                <button
                    type="submit"
                    className="btn btn-default btn-wide">
                    {getLangText('Finish process')}
                </button>
            );
        } else {
            return (
                <div className="modal-footer">
                    <p className="pull-right">
                        <Button
                            className="btn btn-default btn-sm ascribe-margin-1px"
                            type="submit">
                            {getLangText('LOAN')}
                        </Button>
                    </p>
                </div>
            );
        }
    },

    render() {
        return (
            <Form
                className={classnames({'ascribe-form-bordered': this.props.loanHeading})}
                ref='form'
                url={this.props.url}
                getFormData={this.getFormData}
                onReset={this.handleOnChange}
                handleSuccess={this.props.handleSuccess}
                buttons={this.getButtons()}
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>}>
                <div className={classnames({'ascribe-form-header': true, 'hidden': !this.props.loanHeading})}>
                    <h3>{this.props.loanHeading}</h3>
                </div>
                <AclInformation aim={'form'} verbs={['acl_loan']}/>
                <Property
                    name='loanee'
                    label={getLangText('Loanee Email')}
                    editable={!this.props.email}
                    onChange={this.handleOnChange}
                    overrideForm={!!this.props.email}>
                    <input
                        value={this.props.email}
                        type="email"
                        placeholder={getLangText('Email of the loanee')}
                        required/>
                </Property>
                <Property
                    name='gallery'
                    label={getLangText('Gallery/exhibition (optional)')}
                    editable={!this.props.gallery}
                    overrideForm={!!this.props.gallery}>
                    <input
                        value={this.props.gallery}
                        type="text"
                        placeholder={getLangText('Gallery/exhibition (optional)')}/>
                </Property>
                <Property
                    name='startdate'
                    label={getLangText('Start date')}
                    editable={!this.props.startdate}
                    overrideForm={!!this.props.startdate}
                    hidden={!this.props.showStartDate}>
                    <InputDate
                        defaultValue={this.props.startdate}
                        placeholderText={getLangText('Loan start date')} />
                </Property>
                <Property
                    name='enddate'
                    editable={!this.props.enddate}
                    overrideForm={!!this.props.enddate}
                    label={getLangText('End date')}
                    hidden={!this.props.showEndDate}>
                    <InputDate
                        defaultValue={this.props.enddate}
                        placeholderText={getLangText('Loan end date')} />
                </Property>
                <Property
                    name='loan_message'
                    label={getLangText('Personal Message')}
                    editable={true}
                    overrideForm={true}
                    hidden={!this.props.showPersonalMessage}>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required={this.props.showPersonalMessage ? true : false}/>
                </Property>
                {this.getContractCheckbox()}
                {this.getAppendix()}
                <Property
                    name='password'
                    label={getLangText('Password')}
                    hidden={!this.props.showPassword}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required={this.props.showPassword ? 'required' : ''}/>
                </Property>
                {this.props.children}
            </Form>
        );
    }
});

export default LoanForm;
