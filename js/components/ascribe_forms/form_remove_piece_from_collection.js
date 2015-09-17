'use strict';

import React from 'react';
import Form from './form';
import ApiUrls from '../../constants/api_urls';
import { getLangText } from '../../utils/lang_utils';
import { SubmitDangerButton } from '../../lib/buttons';


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
                buttonSubmit={<SubmitDangerButton>{getLangText('YES, REMOVE')}</SubmitDangerButton>}>
                <p>{getLangText('Are you sure you would like to remove this piece from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default PieceRemoveFromCollectionForm;
