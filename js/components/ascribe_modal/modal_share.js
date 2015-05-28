import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';



import ShareForm from '../ascribe_forms/form_share_email'

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
    onRequestHide(e){
        if (e)
            e.preventDefault();
        this.props.onRequestHide();
    },
    render() {
        return (
            <Modal {...this.props} title="Share artwork">
                <div className="modal-body">
                    <ShareForm edition={this.props.edition}
                                currentUser={this.props.currentUser}
                                onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        )
    }
});


export default ShareModalButton;
