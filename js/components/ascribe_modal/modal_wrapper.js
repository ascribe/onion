import React from 'react';
import ReactAddons from 'react/addons';

import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import ModalMixin from '../../mixins/modal_mixin'

let ModalWrapper = React.createClass({

    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>{this.props.tooltip}</Tooltip>}>
                <ModalTrigger modal={
                    <ModalBody
                        title={this.props.title}
                        edition={this.props.edition}
                        currentUser={this.props.currentUser}>
                    {this.props.children}
                    </ModalBody>
                }>
                {this.props.button}
                </ModalTrigger>
            </OverlayTrigger>
        )
    }
});

//
let ModalBody = React.createClass({
    mixins : [ModalMixin],

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child, i) => {
            return ReactAddons.addons.cloneWithProps(child, {
                edition: this.props.edition,
                currentUser: this.props.currentUser,
                onRequestHide: this.onRequestHide
            });
        });
    },
    render() {
        return (
            <Modal {...this.props} title={this.props.title}>
                <div className="modal-body">
                {this.renderChildren()}
                </div>
            </Modal>
        )
    }
});


export default ModalWrapper;
