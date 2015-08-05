'use strict';

import React from 'react';

import requests from '../../utils/requests';
import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import { getLangText } from '../../utils/lang_utils';

let EditionDeleteForm = React.createClass({

    mixins: [FormMixin],

    url() {
        return requests.prepareUrl(ApiUrls.edition_delete, {edition_id: this.getBitcoinIds().join()});
    },
    httpVerb(){
        return 'delete';
    },

    renderForm () {
        return (
            <div className="modal-body">
                <p>{getLangText('Are you sure you would like to permanently delete this edition')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
                <div className="modal-footer">
                    <button
                        type="submit"
                        className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                        onClick={this.submit}>
                        {getLangText('YES, DELETE')}
                    </button>
                </div>
            </div>
        );
    }
});


export default EditionDeleteForm;
