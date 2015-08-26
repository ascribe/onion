'use strict';

import React from 'react';

import classnames from 'classnames';

import Button from 'react-bootstrap/lib/Button';

import LoanForm from './form_loan';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import InputDate from './input_date';
import InputCheckbox from './input_checkbox';

import OwnershipActions from '../../actions/ownership_actions';
import OwnershipStore from '../../stores/ownership_store';

import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';


let LoanRequestAnswerForm = React.createClass({
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
        return OwnershipStore.getState();
    },

    componentDidMount() {
        OwnershipStore.listen(this.onChange);
        OwnershipActions.fetchLoanRequest(this.props.id.piece_id);
    },

    componentWillUnmount() {
        OwnershipStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },


    render() {
        console.log(this.state.loanRequest)
        if (this.state.loanRequest) {
            return (
                <LoanForm
                    loanHeading={null}
                    message={''}
                    id={this.props.id}
                    url={this.props.url}
                    email={this.state.loanRequest.new_owner}
                    gallery={this.state.loanRequest.gallery}
                    showPassword={true}
                    showPersonalMessage={false}
                    handleSuccess={this.handleLoanSuccess}/>
            );
        }
        return null;
    }
});

export default LoanRequestAnswerForm;