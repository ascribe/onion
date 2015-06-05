'use strict';

import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import UnConsignRequestForm from '../ascribe_forms/form_unconsign_request';
import ModalMixin from '../../mixins/modal_mixin';

let UnConsignRequestModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>Request to unconsign the artwork</Tooltip>}>
                <ModalTrigger modal={<UnConsignRequestModal edition={this.props.edition}
                                                            currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv">
                        UNCONSIGN REQUEST
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        );
    }
});

let UnConsignRequestModal = React.createClass({
    mixins: [ModalMixin],

    render() {
        return (
            <Modal {...this.props} title="Request to unconsign artwork">
                <div className="modal-body">
                    <UnConsignRequestForm edition={this.props.edition}
                                 currentUser={this.props.currentUser}
                                 onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        );
    }
});


export default UnConsignRequestModalButton;
