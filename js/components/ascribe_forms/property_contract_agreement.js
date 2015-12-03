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
        createPublicContractAgreement: React.PropTypes.string,
        email: React.PropTypes.string,
        embedClassName: React.PropTypes.string,
        label: React.PropTypes.string
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

        if (nextEmail && this.props.email !== nextEmail && isEmail(nextEmail)) {
            this.getContractAgreementsOrCreatePublic(nextEmail);
        } else if (contractAgreementList && contractAgreementList.length > 0) {
            ContractAgreementListActions.flushContractAgreementList();
        }
    },

    componentWillUnmount() {
        ContractAgreementListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getFormDataForProperty() {
        return this.getContractAgreementId();
    },

    getContractAgreementId() {
        if (this.state.contractAgreementList && this.state.contractAgreementList.length > 0) {
            return { 'contract_agreement_id': this.state.contractAgreementList[0].id };
        } else {
            return {};
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
                        label={getLangText('Appendix')}>
                        <pre className="ascribe-pre">{appendix.default}</pre>
                    </Property>
                );
            }
        }
    },

    getContractCheckbox() {
        const { contractAgreementList } = this.state;

        if (contractAgreementList && contractAgreementList.length > 0) {
            // we need to define a key on the InputCheckboxes as otherwise
            // react is not rerendering them on a store switch and is keeping
            // the default value of the component (which is in that case true)
            const contractAgreement = contractAgreementList[0];
            const { issuer: contractIssuer, blob: { url_safe: contractUrl } } = contractAgreement.contract;

            if (contractAgreement.datetime_accepted) {
                return (
                    <Property
                        name="terms"
                        label={this.props.label}
                        hidden={false}
                        className="notification-contract-pdf">
                        <embed
                            className={this.props.embedClassName}
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
                        name="terms"
                        className="ascribe-property-collapsible-toggle"
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
            <div>
                {this.getContractCheckbox()}
                {this.getAppendix()}
            </div>
        );
    }
});

export default ContractAgreementProperty;
