'use strict';

import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import UnConsignForm from '../ascribe_forms/form_unconsign';
import ModalMixin from '../../mixins/modal_mixin';

let UnConsignModalButton = React.createClass({
    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>Unconsign this artwork</Tooltip>}>
                <ModalTrigger modal={<UnConsignModal edition={this.props.edition}
                                                   currentUser={this.props.currentUser}/>}>
                    <div className="btn btn-ascribe-inv">
                        UNCONSIGN
                    </div>
                </ModalTrigger>
            </OverlayTrigger>
        );
    }
});

let UnConsignModal = React.createClass({
    mixins: [ModalMixin],

    render() {
        return (
            <Modal {...this.props} title="Consign artwork">
                <div className="modal-body">
                    <UnConsignForm edition={this.props.edition}
                                 currentUser={this.props.currentUser}
                                 onRequestHide={this.onRequestHide}/>
                </div>
            </Modal>
        );
    }
});


export default UnConsignModalButton;
