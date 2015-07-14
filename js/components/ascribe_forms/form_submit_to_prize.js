'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils.js';

let PieceSubmitToPrizeForm = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,

        // this is set by ModalWrapper automatically
        onRequestHide: React.PropTypes.func
    },

    getFormData() {
        return this.props.piece;
    },

    render() {
        console.log(this.props);
        return (
            <Form
                ref='form'
                url={ApiUrls.pieces_list}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">{getLangText('SUBMIT TO PRIZE')}</button>
                            <button
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                style={{marginLeft: '0'}}
                                onClick={this.props.onRequestHide}>{getLangText('CLOSE')}</button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>}>
                <p>{getLangText('Are you sure you want to submit to the art prize?')}</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default PieceSubmitToPrizeForm;
