import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import TransferForm from '../ascribe_forms/form_transfer'


let TransferModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>Transfer the ownership of the artwork</Tooltip>}>
                <ModalTrigger modal={<TransferModal edition={this.props.edition}
                                                    currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv">
                        TRANSFER
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        )
    }
});

let TransferModal = React.createClass({
    onRequestHide(e){
        e.preventDefault();
        this.props.onRequestHide();
    },
    render() {
        return (
            <Modal {...this.props} title="Transfer artwork">
                <div className="modal-body">
                    <TransferForm edition={this.props.edition}
                                  currentUser={this.props.currentUser}
                                  onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        )
    }
});


export default TransferModalButton;
