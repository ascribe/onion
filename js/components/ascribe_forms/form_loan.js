'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import InputDate from './input_date';
import InputCheckbox from './input_checkbox';

import LoanContractStore from '../../stores/loan_contract_store';
import LoanContractActions from '../../actions/loan_contract_actions';

import AppConstants from '../../constants/application_constants';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';


let LoanForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        onRequestHide: React.PropTypes.func,
        handleSuccess: React.PropTypes.func
    },

    getInitialState() {
        return LoanContractStore.getState();
    },

    componentDidMount() {
        LoanContractStore.listen(this.onChange);
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
            return (
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox
                        defaultValue={false}>
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
                    hidden={true}
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <input
                        ref="input"
                        type="checkbox"
                        defaultValue={true} />
                </Property>
            );
        }
    },

    onRequestHide() {
        // Since the modal can be opened without sending it to the server
        // and therefore clearing the store,
        // we'll need to make sure to flush the store once the
        // modal unmounts
        LoanContractActions.updateLoanContract({
            contractUrl: null,
            contractEmail: null,
            contractKey: null
        });

        this.props.onRequestHide();
    },

    render() {

        return (
            <Form
                ref='form'
                url={this.props.url}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">{getLangText('LOAN')}</Button>
                            <Button
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                style={{marginLeft: '0'}}
                                onClick={this.onRequestHide}>{getLangText('CLOSE')}</Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>}>
                <Property
                    name='loanee'
                    label={getLangText('Loanee Email')}
                    onBlur={this.handleOnBlur}>
                    <input
                        type="email"
                        placeholder={getLangText('Email of the loanee')}
                        required/>
                </Property>
                <Property
                    name='gallery_name'
                    label={getLangText('Gallery/exhibition (optional)')}
                    onBlur={this.handleOnBlur}>
                    <input
                        type="text"
                        placeholder={getLangText('Gallery/exhibition (optional)')}/>
                </Property>
                <Property
                    name='startdate'
                    label={getLangText('Start date')}>
                    <InputDate
                        placeholderText={getLangText('Loan start date')} />
                </Property>
                <Property
                    name='enddate'
                    label={getLangText('End date')}>
                    <InputDate
                        placeholderText={getLangText('Loan end date')} />
                </Property>
                <Property
                    name='loan_message'
                    label={getLangText('Personal Message')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
                
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required/>
                </Property>
                {this.getContractCheckbox()}
            </Form>
        );
    }
});

export default LoanForm;