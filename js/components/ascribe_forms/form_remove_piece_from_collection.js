'use strict';

import React from 'react';

import Form from './form';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';


let PieceRemoveFromCollectionForm = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,

        // Propagated by ModalWrapper in most cases
        handleSuccess: React.PropTypes.func
    },

    getFormData() {
        return {
            piece_id: this.props.pieceId
        };
    },

    render () {
        return (
            <Form
                ref='form'
                url={ApiUrls.piece_remove_from_collection}
                getFormData={this.getFormData}
                method="delete"
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <button
                                type="submit"
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                onClick={this.submit}>
                                {getLangText('YES, REMOVE')}
                            </button>
                        </p>
                    </div>
                }
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>
                }>
                <p>{getLangText('Are you sure you would like to remove this piece from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default PieceRemoveFromCollectionForm;
