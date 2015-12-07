'use strict';

import React from 'react';
import Moment from 'moment';

import LoanForm from './form_loan';

import OwnershipActions from '../../actions/ownership_actions';
import OwnershipStore from '../../stores/ownership_store';

import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';


let LoanRequestAnswerForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        handleSuccess: React.PropTypes.func.isRequired
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
        let startDate = null;
        let endDate = null;

        if (this.state.loanRequest) {
            startDate = new Moment(this.state.loanRequest.datetime_from, Moment.ISO_8601);
            endDate = new Moment(this.state.loanRequest.datetime_to, Moment.ISO_8601);

            return (
                <LoanForm
                    loanHeading={null}
                    message={''}
                    id={this.props.id}
                    url={this.props.url}
                    email={this.state.loanRequest ? this.state.loanRequest.new_owner : null}
                    gallery={this.state.loanRequest ? this.state.loanRequest.gallery : null}
                    startDate={startDate}
                    endDate={endDate}
                    showPassword={true}
                    showPersonalMessage={false}
                    handleSuccess={this.props.handleSuccess}/>
            );
        }
        return <span/>;
    }
});

export default LoanRequestAnswerForm;
