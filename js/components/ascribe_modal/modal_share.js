import fetch from 'isomorphic-fetch';

import AppConstants from '../../constants/application_constants';
import FetchApiUtils from '../../utils/fetch_api_utils';

import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';


let ShareModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left" overlay={<Tooltip>Share the artwork</Tooltip>}>
                <ModalTrigger modal={<ShareModal edition={this.props.edition}
                                                 currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv btn-glyph-ascribe">
                        <span className="glyph-ascribe-share2"></span>
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        )
    }
});

let ShareModal = React.createClass({
    render() {
        return (
            <Modal {...this.props} title="Share artwork">
                <div className="modal-body">
                    <ShareForm edition={this.props.edition}
                               currentUser={this.props.currentUser}/>
                </div>
            </Modal>
        )
    }
});

let ShareForm = React.createClass({
    submit(e) {
        e.preventDefault();
        let url = "http://localhost:8000/api/ownership/shares/mail/";
        fetch(url, {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.getFormData())
        })
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            share_emails: this.refs.share_emails.getDOMNode().value,
            share_message: this.refs.share_message.getDOMNode().value
        }
    },
    renderTextInput(id, placeHolder, required){
        return(
            <div className="form-group">
                <input className="form-control input-text-ascribe" name={id} ref={id}
                    placeholder={placeHolder} required={required} type="text" />
            </div>
        )
    },
    renderTextArea(id, placeHolder, required){
        return(
            <div className="form-group">
                <textarea className="form-control input-text-ascribe textarea-ascribe-message" name={id} ref={id}
                    defaultValue={placeHolder} required={required}></textarea>
            </div>
        )
    },
    render() {
        let content = "Hi,\n\nI am sharing \"" + this.props.edition.title +
                    "\" with you.\n\nTruly yours,\n" + this.props.currentUser.username;
        return (
            <form id="share_modal_content" role="form" onSubmit={this.submit}>
                {this.renderTextInput("share_emails", "Comma separated emails", "required")}
                {this.renderTextArea("share_message", content, "")}
                <div className="modal-footer">
                    <button type="submit" className="btn btn-ascribe-inv">SHARE</button>
                    <button className="btn btn-ascribe-inv" onClick={this.props.onRequestHide}>CLOSE</button>
                </div>
            </form>
        );
    }
});

export default ShareModalButton;