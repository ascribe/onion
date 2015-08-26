'use strict';

import React from 'react';

import classnames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import InputDate from './input_date';
import InputCheckbox from './input_checkbox';

import LoanContractStore from '../../stores/loan_contract_store';
import LoanContractActions from '../../actions/loan_contract_actions';

import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';


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
        handleSuccess: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            loanHeading: '',
            showPersonalMessage: true,
            showEndDate: false,
            showStartDate: false,
            showPassword: true
        };
    },

    getInitialState() {
        return LoanContractStore.getState();
    },

    componentDidMount() {
        LoanContractStore.listen(this.onChange);
        LoanContractActions.flushLoanContract();
    },

    componentWillUnmount() {
        LoanContractStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getFormData(){
        return this.props.id;
    },

    handleOnBlur(event) {
        LoanContractActions.fetchLoanContract(event.target.value);
    },

    getContractCheckbox() {
        if(this.state.contractKey && this.state.contractUrl) {
            // we need to define a key on the InputCheckboxes as otherwise
            // react is not rerendering them on a store switch and is keeping
            // the default value of the component (which is in that case true)
            return (
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox
                        key="terms_explicitly"
                        defaultChecked={false}>
                        <span>
                            {getLangText('I agree to the')}&nbsp;
                            <a href={this.state.contractUrl} target="_blank">
                                {getLangText('terms of')} {this.state.contractEmail}
                            </a>
                        </span>
                    </InputCheckbox>
                </Property>
            );
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

    getButtons() {
        if(this.props.loanHeading) {
            return (
                <button
                    type="submit"
                    className="btn ascribe-btn ascribe-btn-login">
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
                handleSuccess={this.props.handleSuccess}
                buttons={this.getButtons()}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>}>
                <div className={classnames({'ascribe-form-header': true, 'hidden': !this.props.loanHeading})}>
                    <h3>{this.props.loanHeading}</h3>
                </div>
                <Property
                    name='loanee'
                    label={getLangText('Loanee Email')}
                    onBlur={this.handleOnBlur}
                    editable={!this.props.email}
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
                    hidden={!this.props.showStartDate}>
                    <InputDate
                        defaultValue={this.props.startdate}
                        placeholderText={getLangText('Loan start date')} />
                </Property>
                <Property
                    name='enddate'
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
                    hidden={!this.props.showPersonalMessage}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}
                    hidden={!this.props.showPassword}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required={this.props.showPassword ? 'required' : ''}/>
                </Property>
                {this.getContractCheckbox()}
                {this.props.children}
            </Form>
        );
    }
});

export default LoanForm;