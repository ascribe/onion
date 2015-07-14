'use strict';

import React from 'react';

import { getLangText } from '../../utils/lang_utils.js';
import requests from '../../utils/requests';
import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

let PieceRemoveFromCollectionForm = React.createClass({

    propTypes: {
        pieceId: React.PropTypes.number
    },

    mixins: [FormMixin],

    url() {
        return requests.prepareUrl(apiUrls.piece_remove_from_collection, {piece_id: this.props.pieceId});
    },
    
    httpVerb(){
        return 'delete';
    },

    renderForm () {
        return (
            <div className="modal-body">
                <p>{getLangText('Are you sure you would like to remove this piece from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-danger btn-delete btn-sm ascribe-margin-1px" onClick={this.submit}>{getLangText('YES, REMOVE')}</button>
                    <button className="btn btn-default btn-sm ascribe-margin-1px" style={{marginLeft: '0'}}
                            onClick={this.props.onRequestHide}>{getLangText('CLOSE')}</button>
                </div>
            </div>
        );
    }
});


export default PieceRemoveFromCollectionForm;
