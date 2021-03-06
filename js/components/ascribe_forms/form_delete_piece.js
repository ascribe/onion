'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';

import AclInformation from '../ascribe_buttons/acl_information';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';


let PieceDeleteForm = React.createClass({
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

    render() {
        return (
            <Form
                ref='form'
                url={ApiUrls.piece}
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
                                {getLangText('YES, DELETE')}
                            </button>
                        </p>
                    </div>
                }
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>
                }>
                <AclInformation aim={'form'} verbs={['acl_delete']}/>
                <p>{getLangText('Are you sure you would like to permanently delete this piece')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default PieceDeleteForm;
