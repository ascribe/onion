'use strict'

import React from 'react'

import InputCheckbox from './input_checkbox';
import Property from './property';

import ContractAgreementListStore from '../../stores/contract_agreement_list_store';
import ContractAgreementListActions from '../../actions/contract_agreement_list_actions';

import { getLangText } from '../../utils/lang_utils';
import { isEmail } from '../../utils/regex_utils';

let ContractAgreementProperty = React.createClass({
    propTypes: {
        createPublicContractAgreement: React.PropTypes.bool,
        email: React.PropTypes.string,
        embedClassName: React.PropTypes.string,
        label: React.PropTypes.string,

        // Necessary for Form to pick this element up as a ref
        name: React.PropTypes.string,

        // Passed down from Form element
        handleChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
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

    componentWillReceiveProps({ email: nextEmail }) {
        const { contractAgreementList } = this.state;

        if (this.props.email !== nextEmail) {
            if (isEmail(nextEmail)) {
                this.getContractAgreementsOrCreatePublic(nextEmail);
            } else if (contractAgreementList && contractAgreementList.length > 0) {
                ContractAgreementListActions.flushContractAgreementList();
            }
        }
    },

    componentWillUnmount() {
        ContractAgreementListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getFormDataForProperty() {
        const contractAgreementId = this.getContractAgreementId();
        const formData = {
            'terms': this.refs.terms.state.value
        };

        if (contractAgreementId) {
            formData.contract_agreement_id = contractAgreementId;
        }

        return formData;
    },

    getContractAgreementId() {
        if (this.state.contractAgreementList && this.state.contractAgreementList.length > 0) {
            return this.state.contractAgreementList[0].id;
        }
    },

    getContractAgreementsOrCreatePublic(email) {
        ContractAgreementListActions.flushContractAgreementList.defer();

        if (email) {
            // fetch the available contractagreements (pending/accepted)
            ContractAgreementListActions.fetchAvailableContractAgreementList(email, this.props.createPublicContractAgreement);
        }
    },

    getAppendix() {
        const { contractAgreementList } = this.state;

        if (contractAgreementList && contractAgreementList.length > 0) {
            const appendix = contractAgreementList[0].appendix;
            if (appendix && appendix.default) {
                return (
                    <Property
                        name='appendix'
                        label={getLangText('Appendix')}
                        handleChange={this.props.handleChange}>
                        <pre className="ascribe-pre">{appendix.default}</pre>
                    </Property>
                );
            }
        }
    },

    getContractCheckbox() {
        const { embedClassName, handleChange, label } = this.props;
        const { contractAgreementList } = this.state;

        if (contractAgreementList && contractAgreementList.length > 0) {
            const contractAgreement = contractAgreementList[0];
            const { issuer: contractIssuer, blob: { url_safe: contractUrl } } = contractAgreement.contract;

            // we need to define a key on the InputCheckboxes as otherwise
            // react is not rerendering them on a store switch and is keeping
            // the default value of the component (which is in that case true)
            if (contractAgreement.datetime_accepted) {
                return (
                    <Property
                        ref="terms"
                        name="terms"
                        label={label}
                        hidden={false}
                        handleChange={handleChange}
                        className="notification-contract-pdf">
                        <embed
                            className={embedClassName}
                            src={contractUrl}
                            alt="pdf"
                            pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                        <a href={contractUrl} target="_blank">
                            <span className="glyphicon glyphicon-download" aria-hidden="true" /> {getLangText('Download contract')}
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
                        ref="terms"
                        name="terms"
                        className="ascribe-property-collapsible-toggle"
                        handleChange={handleChange}
                        style={{paddingBottom: 0}}>
                        <InputCheckbox
                            key="terms_explicitly"
                            defaultChecked={false}>
                            <span>
                                {getLangText('I agree to the')}&nbsp;
                                <a href={contractUrl} target="_blank">
                                    {getLangText('terms of ')} {contractIssuer}
                                </a>
                            </span>
                        </InputCheckbox>
                    </Property>
                );
            }
        } else {
            return (
                <Property
                    ref="terms"
                    name="terms"
                    handleChange={handleChange}
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
            <div>
                {this.getContractCheckbox()}
                {this.getAppendix()}
            </div>
        );
    }
});

export default ContractAgreementProperty;
