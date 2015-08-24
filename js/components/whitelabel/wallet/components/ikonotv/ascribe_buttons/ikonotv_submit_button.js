'use strict';

import React from 'react';
import classNames from 'classnames';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

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
                className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                {getLangText('Loan to IkonoTV')}
            </button>
        );
    },

    render() {
        return (
            <ModalWrapper
                trigger={this.getSubmitButton()}
                handleSuccess={this.props.handleSuccess}
                title={getLangText('Loan to IkonoTV')}>

            </ModalWrapper>
            
        );
    }
});

export default IkonotvSubmitButton;