import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import ConsignForm from '../ascribe_forms/form_consign'
import ModalMixin from '../../mixins/modal_mixin'

let ConsignModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>Have someone else sell the artwork</Tooltip>}>
                <ModalTrigger modal={<ConsignModal edition={this.props.edition}
                                                   currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv">
                        CONSIGN
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        )
    }
});

let ConsignModal = React.createClass({
    mixins : [ModalMixin],

    render() {
        return (
            <Modal {...this.props} title="Consign artwork">
                <div className="modal-body">
                    <ConsignForm edition={this.props.edition}
                                 currentUser={this.props.currentUser}
                                 onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        )
    }
});


export default ConsignModalButton;
