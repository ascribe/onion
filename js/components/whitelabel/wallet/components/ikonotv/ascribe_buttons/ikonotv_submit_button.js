'use strict';

import React from 'react';
import Moment from 'moment';
import classNames from 'classnames';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import LoanForm from '../../../../../ascribe_forms/form_loan';

import Property from '../../../../../ascribe_forms/property';
import InputCheckbox from '../../../../../ascribe_forms/input_checkbox';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';

let IkonotvSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired
    },

    getSubmitButton() {
        return (
            <button
                className={classNames('btn', 'btn-default', this.props.className)}>
                {getLangText('Loan to IkonoTV')}
            </button>
        );
    },

    render() {

        let today = new Moment();
        let enddate = new Moment();
        enddate.add(1, 'years');

        return (
            <ModalWrapper
                trigger={this.getSubmitButton()}
                handleSuccess={this.props.handleSuccess}
                title={getLangText('Loan to IkonoTV archive')}>
                <LoanForm
                    id={{piece_id: this.props.piece.id}}
                    url={ApiUrls.ownership_loans_pieces}
                    email="submissions@ikono.org"
                    startdate={today}
                    enddate={enddate}
                    gallery="IkonoTV archive"
                    showPersonalMessage={false}
                    handleSuccess={this.props.handleSuccess} />
            </ModalWrapper>
            
        );
    }
});

export default IkonotvSubmitButton;
