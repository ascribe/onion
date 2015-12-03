'use strict';

import React from 'react/addons';

import InputCheckbox from './input_checkbox';

import ContractAgreementListStore from '../../stores/contract_agreement_list_store';
import ContractAgreementListActions from '../../actions/contract_agreement_list_actions';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';
import { isEmail } from '../../utils/regex_utils';


const InputContractAgreementCheckbox = React.createClass({
    propTypes: {
        createPublicContractAgreement: React.PropTypes.bool,
        email: React.PropTypes.string,
        
        required: React.PropTypes.bool,

        // provided by Property
        disabled: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        name: React.PropTypes.string,
        setExpanded: React.PropTypes.func,

        // can be used to style the component from the outside
        style: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            createPublicContractAgreement: true
        };
    },

    getInitialState() {
        return mergeOptions(
            ContractAgreementListStore.getState(),
            {
                value: {
                    terms: null,
                    contract_agreement_id: null
                }
            }
        );
    },

    componentDidMount() {
        ContractAgreementListStore.listen(this.onStoreChange);
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
        ContractAgreementListStore.unlisten(this.onStoreChange);
    },

    onStoreChange(state) {
        const contractAgreement = this.getContractAgreement(state.contractAgreementList);
        this.props.setExpanded(!!contractAgreement);

        state = mergeOptions(state, {
            value: {
                contract_agreement_id: contractAgreement ? contractAgreement.id : null,
                terms: !contractAgreement || !!contractAgreement.datetime_accepted
            }
        });
        
        this.setState(state);
    },

    onChange(event) {
        this.setState({
            value: React.addons.update(this.state.value, {
                terms: { $set: event.target.value }
            })
        });
        this.props.onChange(event);
    },

    getContractAgreement(contractAgreementList) {
        if (contractAgreementList && contractAgreementList.length > 0) {
            return contractAgreementList[0];
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
                    <pre className="ascribe-pre">{appendix.default}</pre>
                );
            }
        }
    },

    getContractCheckbox() {
        const { name,
                disabled,
                style } = this.props;
        const { contractAgreementList } = this.state;
        const inputCheckboxProps = {
            name,
            disabled,
            style,
            onChange: this.onChange
        };

        if (contractAgreementList && contractAgreementList.length > 0) {
            const contractAgreement = contractAgreementList[0];
            const { issuer: contractIssuer, blob: { url_safe: contractUrl } } = contractAgreement.contract;

            
            if (contractAgreement.datetime_accepted) {
                // For `InputCheckbox` we want to override style in this case
                Object.assign(inputCheckboxProps, { style: { 'display': 'none' } });

                return (
                    <div className="notification-contract-pdf">
                        <embed
                            className="loan-form"
                            src={contractUrl}
                            alt="pdf"
                            pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                        <a href={contractUrl} target="_blank">
                            <span className="glyphicon glyphicon-download" aria-hidden="true" /> {getLangText('Download contract')}
                        </a>
                        <InputCheckbox
                            {...inputCheckboxProps}
                            key="terms_implicitly"
                            defaultChecked={true} />
                    </div>
                );
            } else {
                return (
                    <InputCheckbox
                        {...inputCheckboxProps}
                        key="terms_explicitly"
                        defaultChecked={false}>
                        <span>
                            {getLangText('I agree to the')}&nbsp;
                            <a href={contractUrl} target="_blank">
                                {getLangText('terms of ')} {contractIssuer}
                            </a>
                        </span>
                    </InputCheckbox>
                );
            }
        } else {
            return (
                <InputCheckbox
                    {...inputCheckboxProps}
                    key="terms_implicitly"
                    defaultChecked={true} />
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

export default InputContractAgreementCheckbox;