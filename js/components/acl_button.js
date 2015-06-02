import React from 'react';

import ConsignForm from './ascribe_forms/form_consign';
import TransferForm from './ascribe_forms/form_transfer';
import LoanForm from './ascribe_forms/form_loan';
import ShareForm from './ascribe_forms/form_share_email';
import ModalWrapper from './ascribe_modal/modal_wrapper';
import AppConstants from '../constants/application_constants';

let AclButton = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        availableAcls: React.PropTypes.array.isRequired,
        editions: React.PropTypes.array.isRequired,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func.isRequired
    },

    actionProperties(){
        if (this.props.action == 'consign'){
            return {
                title: "Consign artwork",
                tooltip: "Have someone else sell the artwork",
                form: <ConsignForm />
            }
        }
        else if (this.props.action == 'transfer') {
            return {
                title: "Transfer artwork",
                tooltip: "Transfer the ownership of the artwork",
                form: <TransferForm />
            }
        }
        else if (this.props.action == 'loan'){
            return {
                title: "Loan artwork",
                tooltip: "Loan your artwork for a limited period of time",
                form: <LoanForm />}
        }
        else if (this.props.action == 'share'){
            return {
                title: "Share artwork",
                tooltip: "Share the artwork",
                form: <ShareForm />}
        }
    },
    render() {
        let shouldDisplay = this.props.availableAcls.indexOf(this.props.action) > -1;
        let aclProps = this.actionProperties();
        return (
            <ModalWrapper
                button={
                    <div className={shouldDisplay ? 'btn btn-default btn-sm' : 'hidden'}>
                        {this.props.action.toUpperCase()}
                    </div>
                }
                currentUser={ this.props.currentUser }
                editions={ this.props.editions }
                handleSuccess={ this.props.handleSuccess }
                title={ aclProps.title }
                tooltip={ aclProps.tooltip }>
                { aclProps.form }
            </ModalWrapper>
        );
    }
});

export default AclButton;