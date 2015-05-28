import fetch from 'isomorphic-fetch';

import React from 'react';

import AppConstants from '../../constants/application_constants';
import FetchApiUtils from '../../utils/fetch_api_utils';
import FormMixin from '../../mixins/form_alert_mixin';

let ShareForm = React.createClass({
    mixins: [FormMixin],

    submit(e) {
        e.preventDefault();
        fetch(AppConstants.baseUrl + 'ownership/shares/mail/', {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.getFormData())
        })
            .then(
            (response) => this.handleResponse(response)
        );
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            share_emails: this.refs.share_emails.getDOMNode().value,
            share_message: this.refs.share_message.getDOMNode().value
        }
    },
    renderMessage() {
        return "" +
            "Hi,\n" +
            "\n" +
            "I am sharing \"" + this.props.edition.title + "\" with you.\n" +
            "\n" +
            "Truly yours,\n" +
            this.props.currentUser.username;
    },
    render() {
        return (
            <form id="share_modal_content" role="form" onSubmit={this.submit}>
                {this.renderTextInput("share_emails", "email", "Comma separated emails", "required")}
                {this.renderTextArea("share_message", this.renderMessage(), "")}
                <div className="modal-footer">
                    <button type="submit" className="btn btn-ascribe-inv">SHARE</button>
                    <button className="btn btn-ascribe-inv" onClick={this.props.onRequestHide}>CLOSE</button>
                </div>
            </form>
        );
    }
});

export default ShareForm;