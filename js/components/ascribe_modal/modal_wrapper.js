'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ModalTrigger from 'react-bootstrap/lib/ModalTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import ModalMixin from '../../mixins/modal_mixin';

let ModalWrapper = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        editions: React.PropTypes.array.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        onRequestHide: React.PropTypes.func,
        handleSuccess: React.PropTypes.func.isRequired,
        button: React.PropTypes.object.isRequired,
        children: React.PropTypes.object,
        tooltip: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>{this.props.tooltip}</Tooltip>}>
                <ModalTrigger modal={
                    <ModalBody
                        title={this.props.title}
                        editions={this.props.editions}
                        currentUser={this.props.currentUser}
                        handleSuccess={this.props.handleSuccess}>
                    {this.props.children}
                    </ModalBody>
                }>
                {this.props.button}
                </ModalTrigger>
            </OverlayTrigger>
        );
    }
});


let ModalBody = React.createClass({
    propTypes: {
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object,
        onRequestHide: React.PropTypes.func,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.object,
        title: React.PropTypes.string.isRequired
    },

    mixins: [ModalMixin],

    handleSuccess(response){
        this.props.handleSuccess(response);
        this.props.onRequestHide();
    },

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child) => {
            return ReactAddons.addons.cloneWithProps(child, {
                editions: this.props.editions,
                currentUser: this.props.currentUser,
                onRequestHide: this.onRequestHide,
                handleSuccess: this.handleSuccess
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
        );
    }
});


export default ModalWrapper;
