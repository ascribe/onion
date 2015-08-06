'use strict';

import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';

import AclButton from './../ascribe_buttons/acl_button';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';

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
        let buttonAccept = (
            <div id="request_accept"
                onClick={this.handleRequest}
                className='btn btn-default btn-sm ascribe-margin-1px'>{getLangText('ACCEPT')}
            </div>);
        if (edition.request_action === 'unconsign') {
            buttonAccept = (
                <AclButton
                    availableAcls={{'acl_unconsign': true}}
                    action="acl_unconsign"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                );
        }
        let buttons = (
            <span>
                <span>
                    {buttonAccept}
                </span>
                <span>
                    <div id="request_deny" onClick={this.handleRequest} className='btn btn-danger btn-delete btn-sm ascribe-margin-1px'>{getLangText('REJECT')}</div>
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
                <div style={{textAlign: 'center'}}>
                <div>{ edition.owner } {getLangText('requests you')} { edition.request_action } {getLangText('this edition%s', '.')}&nbsp;&nbsp;</div>
                {buttons}
                </div>
            </Alert>
        );
    }
});


export default RequestActionForm;