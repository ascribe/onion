import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import LoanForm from '../ascribe_forms/form_loan'
import ModalMixin from '../../mixins/modal_mixin'

let LoanModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>Loan your artwork for a limited period of time</Tooltip>}>
                <ModalTrigger modal={<LoanModal edition={this.props.edition}
                                                currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv">
                        LOAN
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        )
    }
});

let LoanModal = React.createClass({
    mixins : [ModalMixin],

    render() {
        return (
            <Modal {...this.props} title="Loan artwork">
                <div className="modal-body">
                    <LoanForm edition={this.props.edition}
                              currentUser={this.props.currentUser}
                              onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        )
    }
});


export default LoanModalButton;
