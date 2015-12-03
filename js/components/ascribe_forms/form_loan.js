'use strict';

import React from 'react';

import classnames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import ContractAgreementProperty from './property_contract_agreement';
import Form from './form';
import InputTextAreaToggable from './input_textarea_toggable';
import InputDate from './input_date';
import Property from './property';

import AscribeSpinner from '../ascribe_spinner';

import AclInformation from '../ascribe_buttons/acl_information';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';

let LoanForm = React.createClass({
    propTypes: {
        loanHeading: React.PropTypes.string,
        email: React.PropTypes.string,
        gallery: React.PropTypes.string,
        startDate: React.PropTypes.object,
        endDate: React.PropTypes.object,
        showPersonalMessage: React.PropTypes.bool,
        showEndDate: React.PropTypes.bool,
        showStartDate: React.PropTypes.bool,
        showPassword: React.PropTypes.bool,
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        createPublicContractAgreement: React.PropTypes.bool,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getDefaultProps() {
        return {
            loanHeading: '',
            showPersonalMessage: true,
            showEndDate: true,
            showStartDate: true,
            showPassword: true
        };
    },

    getInitialState() {
        return {
            email: this.props.email || ''
        };
    },

    getFormData() {
        return mergeOptions(
            this.props.id,
            this.refs.contractAgreement.getFormDataForProperty()
        );
    },

    handleEmailOnChange(event) {
        // event.target.value is the submitted email of the loanee
        this.setState({
            email: event && event.target && event.target.value || ''
        });
    },

    handleReset(event) {
        this.handleEmailOnChange();
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
        const { email } = this.state;
        const {
            children,
            createPublicContractAgreement,
            email: defaultEmail,
            handleSuccess,
            gallery,
            loanHeading,
            message,
            showPersonalMessage,
            endDate,
            startDate,
            showEndDate,
            showStartDate,
            showPassword,
            url } = this.props;

        return (
            <Form
                className={classnames({'ascribe-form-bordered': loanHeading})}
                ref='form'
                url={url}
                getFormData={this.getFormData}
                onReset={this.handleReset}
                handleSuccess={handleSuccess}
                buttons={this.getButtons()}
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>}>
                <div className={classnames({'ascribe-form-header': true, 'hidden': !loanHeading})}>
                    <h3>{loanHeading}</h3>
                </div>
                <AclInformation aim={'form'} verbs={['acl_loan']}/>
                <Property
                    name='loanee'
                    label={getLangText('Loanee Email')}
                    editable={!defaultEmail}
                    onChange={this.handleEmailOnChange}
                    overrideForm={!!defaultEmail}>
                    <input
                        value={email}
                        type="email"
                        placeholder={getLangText('Email of the loanee')}
                        required/>
                </Property>
                <Property
                    name='gallery'
                    label={getLangText('Gallery/exhibition (optional)')}
                    editable={!gallery}
                    overrideForm={!!gallery}>
                    <input
                        value={gallery}
                        type="text"
                        placeholder={getLangText('Gallery/exhibition (optional)')}/>
                </Property>
                <Property
                    name='startdate'
                    label={getLangText('Start date')}
                    editable={!startDate}
                    overrideForm={!!startDate}
                    hidden={!showStartDate}>
                    <InputDate
                        defaultValue={startDate}
                        placeholderText={getLangText('Loan start date')} />
                </Property>
                <Property
                    name='enddate'
                    editable={!endDate}
                    overrideForm={!!endDate}
                    label={getLangText('End date')}
                    hidden={!showEndDate}>
                    <InputDate
                        defaultValue={endDate}
                        placeholderText={getLangText('Loan end date')} />
                </Property>
                <Property
                    name='loan_message'
                    label={getLangText('Personal Message')}
                    editable={true}
                    overrideForm={true}
                    hidden={!showPersonalMessage}>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={message}
                        placeholder={getLangText('Enter a message...')}
                        required={showPersonalMessage}/>
                </Property>
                <ContractAgreementProperty
                    ref='contractAgreement'
                    createPublicContractAgreement={createPublicContractAgreement}
                    email={email}
                    embedClassName={'loan-form'}
                    label={getLangText('Loan Contract')} />
                <Property
                    name='password'
                    label={getLangText('Password')}
                    hidden={!showPassword}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required={showPassword ? 'required' : ''}/>
                </Property>
                {children}
            </Form>
        );
    }
});

export default LoanForm;
