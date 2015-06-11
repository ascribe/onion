'use strict';

import React from 'react';

import fetch from '../../utils/fetch';
import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

let EditionRemoveFromCollectionForm = React.createClass({

    mixins: [FormMixin],

    url() {
        return fetch.prepareUrl(apiUrls.edition_remove_from_collection, {edition_id: this.getBitcoinIds().join()});
    },
    httpVerb(){
        return 'delete';
    },

    renderForm () {
        return (
            <div className="modal-body">
                <p>Are you sure you would like to remove these editions from your collection&#63;</p>
                <p>This is an irrevocable action.</p>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-ascribe-inv" onClick={this.submit}>YES, REMOVE</button>
                    <button className="btn btn-ascribe" onClick={this.props.onRequestHide}>CLOSE</button>
                </div>
            </div>
        );
    }
});


export default EditionRemoveFromCollectionForm;