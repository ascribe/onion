'use strict';

import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

import AppConstants from '../../constants/application_constants';

let RequestActionForm = React.createClass({
    mixins: [FormMixin],

    url(e){
        let edition = this.props.editions[0];
        if (e.target.id === 'request_accept'){
            if (edition.request_action === 'consign'){
                return apiUrls.ownership_consigns_confirm;
            }
            else if (edition.request_action === 'unconsign'){
                return apiUrls.ownership_unconsigns;
            }
            else if (edition.request_action === 'loan'){
                return apiUrls.ownership_loans_confirm;
            }
        }
        else if(e.target.id === 'request_deny'){
            if (edition.request_action === 'consign') {
                return apiUrls.ownership_consigns_deny;
            }
            else if (edition.request_action === 'unconsign') {
                return apiUrls.ownership_unconsigns_deny;
            }
            else if (edition.request_action === 'loan') {
                return apiUrls.ownership_loans_deny;
            }
        }
    },

    handleRequest: function(e){
        e.preventDefault();
        this.submit(e);
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join()
        };
    },

    renderForm() {
        let edition = this.props.editions[0];
        let buttons = (
                <span>
                    <span>
                        <div id="request_accept" onClick={this.handleRequest} className='btn btn-default btn-sm'>ACCEPT</div>
                    </span>
                    <span>
                        <div id="request_deny" onClick={this.handleRequest} className='btn btn-default btn-sm'>REJECT</div>
                    </span>
                </span>
        );
        if (this.state.submitted){
            buttons = (
                <span>
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </span>
            );
        }
        return (
            <Alert bsStyle='warning'>
                <span>{ edition.owner } requests you { edition.request_action } this edition.&nbsp;&nbsp;</span>
                {buttons}
            </Alert>
        );
    }
});


export default RequestActionForm;