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
        if (this.props.email !== nextEmail) {
            if (isEmail(nextEmail)) {
                this.getContractAgreementsOrCreatePublic(nextEmail);
            } else if (this.getContractAgreement()) {
                ContractAgreementListActions.flushContractAgreementList();
            }
        }
    },

    componentWillUnmount() {
        ContractAgreementListStore.unlisten(this.onStoreChange);
    },

    onStoreChange(state) {
        const contractAgreement = this.getContractAgreement(state.contractAgreementList);

        // If there is no contract available, hide this `Property` from the user
        this.props.setExpanded(!!contractAgreement);

        state = mergeOptions(state, {
            value: {
                // If `email` is defined in this component, `getContractAgreementsOrCreatePublic`
                // is either:
                //
                // - fetching a already existing contract agreement; or
                // - trying to create a contract agreement
                //
                // If both attempts result in `contractAgreement` being not defined,
                // it means that the receiver hasn't defined a contract, which means
                // a contract agreement cannot be created, which means we don't have to
                // specify `contract_agreement_id` when sending a request to the server.
                contract_agreement_id: contractAgreement ? contractAgreement.id : null,
                // If the receiver hasn't set a contract or the contract was
                // previously accepted, we set the terms to `true`
                // as we always need to at least give a boolean value for `terms`
                // to the API endpoint
                terms: !contractAgreement || !!contractAgreement.datetime_accepted
            }
        });

        this.setState(state);
    },

    onChange(event) {
        // Sync the value between our `InputCheckbox` and this component's `terms`
        // so the parent `Property` is able to get the correct value of this component
        // when the `Form` queries it.
        this.setState({
            value: React.addons.update(this.state.value, {
                terms: { $set: event.target.value }
            })
        });

        // Propagate change events from the checkbox up to the parent `Property`
        this.props.onChange(event);
    },

    getContractAgreement(contractAgreementList = this.state.contractAgreementList) {
        if (contractAgreementList && contractAgreementList.length) {
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
        const contractAgreement = this.getContractAgreement();

        if (contractAgreement &&
            contractAgreement.appendix &&
            contractAgreement.appendix.default) {
            return (
                <div className="ascribe-property contract-appendix-form">
                    <p><span>{getLangText('Appendix')}</span></p>
                    <pre className="ascribe-pre">{contractAgreement.appendix.default}</pre>
                </div>
            );
        }
    },

    getContractCheckbox() {
        const contractAgreement = this.getContractAgreement();

        if(contractAgreement) {
            const {
                datetime_accepted: datetimeAccepted,
                contract: {
                    issuer: contractIssuer,
                    blob: { url_safe: contractUrl }
                }
            } = contractAgreement;

            if(datetimeAccepted) {
                return (
                    <div
                        className="notification-contract-pdf"
                        style={{paddingBottom: '0.25em'}}>
                        <embed
                            className="embed-form"
                            src={contractUrl}
                            alt="pdf"
                            pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                        <a href={contractUrl} target="_blank">
                            <span className="glyphicon glyphicon-download" aria-hidden="true" /> {getLangText('Download contract')}
                        </a>
                    </div>
                );
            } else {
                const {
                    name,
                    disabled,
                    style } = this.props;

                return (
                    <InputCheckbox
                        name={name}
                        disabled={disabled}
                        style={style}
                        onChange={this.onChange}
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
