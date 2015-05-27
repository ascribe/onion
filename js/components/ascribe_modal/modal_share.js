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
        var content = "Hi,\n\nI am sharing \"" + this.props.edition.title +
                    "\" with you.\n\nTruly yours,\n" + this.props.currentUser.username;
        return (
            <Modal {...this.props} title="Share artwork">
                <div className="modal-body">
                    <form id="share_modal_content" role="form">
                        <div className="form-group">
                            <input className="form-control input-text-ascribe" name="share_emails"
                                placeholder="Comma separated emails" required="required" type="text" />
                        </div>
                        <div className="form-group">
                            <textarea className="form-control input-text-ascribe textarea-ascribe-message"
                                name="share_message"
                                defaultValue={content}></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-ascribe-inv">SHARE</button>
                            <button className="btn btn-ascribe-inv" onClick={this.props.onRequestHide}>CLOSE</button>
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }
});

export default ShareModalButton;