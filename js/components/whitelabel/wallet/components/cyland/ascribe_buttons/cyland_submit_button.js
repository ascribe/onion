'use strict';

import React from 'react';
import classNames from 'classnames';

import Moment from 'moment';

import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';
import LoanForm from '../../../../../ascribe_forms/form_loan';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';
import { getAclFormMessage } from '../../../../../../utils/form_utils';

let CylandSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired,
        username: React.PropTypes.string
    },

    getInitialState() {
        return WhitelabelStore.getState();
    },

    componentDidMount() {
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getSubmitButton() {
        return (
            <button
                className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                {getLangText('Submit to Cyland')}
            </button>
        );
    },

    render() {
        let today = new Moment();
        let loanEndDate = new Moment();
        loanEndDate.add(1000, 'years');

        return (
            <ModalWrapper
                trigger={this.getSubmitButton()}
                handleSuccess={this.props.handleSuccess}
                title={getLangText('Submit to Cyland')}>
                <LoanForm
                    message={getAclFormMessage('acl_loan', '\"' + this.props.piece.title + '\"', this.props.username)}
                    id={{piece_id: this.props.piece.id}}
                    url={ApiUrls.ownership_loans_pieces}
                    email={this.state.whitelabel.user}
                    gallery="Cyland Archive"
                    startdate={today}
                    enddate={loanEndDate}
                    showPersonalMessage={false}
                    handleSuccess={this.props.handleSuccess}/>
            </ModalWrapper>
        );
    }
});

export default CylandSubmitButton;