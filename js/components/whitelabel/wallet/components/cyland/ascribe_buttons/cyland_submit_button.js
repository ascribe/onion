'use strict';

import React from 'react';
import classNames from 'classnames';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';
import CylandPieceSubmitForm from '../ascribe_forms/cyland_form_submit';

import { getLangText } from '../../../../../../utils/lang_utils';

let CylandSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired
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
        return (
            <ModalWrapper
                trigger={this.getSubmitButton()}
                handleSuccess={this.props.handleSuccess}
                title={getLangText('Submit to Cyland')}>
                <CylandPieceSubmitForm
                    piece={this.props.piece}
                    handleSuccess={this.props.handleSuccess}/>
            </ModalWrapper>
            
        );
    }
});

export default CylandSubmitButton;