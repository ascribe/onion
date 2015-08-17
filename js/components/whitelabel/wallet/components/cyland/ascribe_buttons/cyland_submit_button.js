'use strict';

import React from 'react';
import classNames from 'classnames';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';
import PieceSubmitToPrizeForm from '../../../../../ascribe_forms/form_submit_to_prize';

import { getLangText } from '../../../../../../utils/lang_utils';

let SubmitToPrizeButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired
    },

    getSubmitButton() {
        if (this.props.piece.prize) {
            return (
                <button
                    disabled
                    className="btn btn-default btn-xs pull-right">
                    {getLangText('Submitted to prize')} <span className="glyphicon glyphicon-ok"
                                                              aria-hidden="true"></span>
                </button>
            );
        }
        else {
            return (
                <button
                    className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                    {getLangText('Submit to Cyland')}
                </button>
            );
        }
    },

    render() {
        return (
            <ModalWrapper
                trigger={this.getSubmitButton()}
                handleSuccess={this.props.handleSuccess}
                title={getLangText('Submit to prize')}>
                <PieceSubmitToPrizeForm
                    piece={this.props.piece}
                    handleSuccess={this.props.handleSuccess}/>
            </ModalWrapper>
            
        );
    }
});

export default SubmitToPrizeButton;