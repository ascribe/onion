'use strict';

import React from 'react';

import requests from '../../utils/requests';
import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

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
                <p>Are you sure you would like to permanently delete this edition&#63;</p>
                <p>This is an irrevocable action.</p>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-ascribe-inv" onClick={this.submit}>YES, DELETE</button>
                    <button className="btn btn-ascribe" onClick={this.props.onRequestHide}>CLOSE</button>
                </div>
            </div>
        );
    }
});


export default EditionDeleteForm;
