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

import { getLangText } from '../../utils/lang_utils';


let LoanForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
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
                                type="submit">
                                {getLangText('LOAN')}
                            </Button>
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
                    label={getLangText('Gallery/exhibition (optional)')}>
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