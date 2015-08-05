'use strict';

import React from 'react';

import { getLangText } from '../../utils/lang_utils.js';
import requests from '../../utils/requests';
import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

let EditionRemoveFromCollectionForm = React.createClass({

    mixins: [FormMixin],

    url() {
        return requests.prepareUrl(apiUrls.edition_remove_from_collection, {edition_id: this.getBitcoinIds().join()});
    },
    
    httpVerb(){
        return 'delete';
    },

    renderForm () {
        return (
            <div className="modal-body">
                <p>{getLangText('Are you sure you would like to remove these editions from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-danger btn-delete btn-sm ascribe-margin-1px" onClick={this.submit}>
                        {getLangText('YES, REMOVE')}
                    </button>
                </div>
            </div>
        );
    }
});


export default EditionRemoveFromCollectionForm;
