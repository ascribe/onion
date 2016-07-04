'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';

import InputContractAgreementCheckbox from './input_contract_agreement_checkbox';
import InputTextAreaToggable from './input_textarea_toggable';


import AscribeSpinner from '../ascribe_spinner';

import AclInformation from '../ascribe_buttons/acl_information';

import { getLangText } from '../../utils/lang';

let ConsignForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        autoFocusProperty: React.PropTypes.string,
        email: React.PropTypes.string,
        message: React.PropTypes.string,
        labels: React.PropTypes.object,
        createPublicContractAgreement: React.PropTypes.bool,
        handleSuccess: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            labels: {}
        };
    },

    getInitialState() {
        return {
            email: this.props.email || ''
        };
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.email !== nextProps.email) {
            this.setState({
                email: nextProps.email
            });
        }
    },

    getFormData() {
        return this.props.id;
    },

    handleEmailOnChange(event) {
        // event.target.value is the submitted email of the consignee
        this.setState({
            email: event && event.target && event.target.value || ''
        });
    },

    render() {
        const { email } = this.state;
        const { autoFocusProperty,
                createPublicContractAgreement,
                email: defaultEmail,
                handleSuccess,
                id,
                message,
                labels,
                url } = this.props;

        return (
            <Form
                ref='form'
                url={url}
                getFormData={this.getFormData}
                handleSuccess={handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">
                                {getLangText('CONSIGN')}
                            </Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>}>
                <AclInformation aim={'form'} verbs={['acl_consign']}/>
                <Property
                    autoFocus={autoFocusProperty === 'email'}
                    name='consignee'
                    label={labels.email || getLangText('Email')}
                    editable={!defaultEmail}
                    onChange={this.handleEmailOnChange}
                    overrideForm={!!defaultEmail}>
                    <input
                        type="email"
                        value={email}
                        placeholder={getLangText('Email of the consignee')}
                        required/>
                </Property>
                <Property
                    autoFocus={autoFocusProperty === 'message'}
                    name='consign_message'
                    label={labels.message || getLangText('Personal Message')}
                    editable
                    overrideForm>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={message}
                        placeholder={getLangText('Enter a message...')}
                        required />
                </Property>
                <Property
                    name='contract_agreement'
                    label={getLangText('Consign Contract')}
                    className="ascribe-property-collapsible-toggle">
                    <InputContractAgreementCheckbox
                        createPublicContractAgreement={createPublicContractAgreement}
                        email={email} />
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required/>
                </Property>
                <hr />
            </Form>
        );
    }
});

export default ConsignForm;
