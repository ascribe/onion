'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import ModalMixin from '../../mixins/modal_mixin';

let ModalWrapper = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        onRequestHide: React.PropTypes.func,
        handleSuccess: React.PropTypes.func.isRequired,
        button: React.PropTypes.object.isRequired,
        children: React.PropTypes.object,
        tooltip: React.PropTypes.string
    },

    getModalTrigger() {
        return (
            <ModalBody
                title={this.props.title}
                handleSuccess={this.props.handleSuccess}>
                {this.props.children}
            </ModalBody>
        );
    },

    render() {
        if(this.props.tooltip) {
            return (
                <OverlayTrigger
                    delay={500}
                    placement="left"
                    overlay={<Tooltip>{this.props.tooltip}</Tooltip>}>
                    {this.getModalTrigger()}
                </OverlayTrigger>
            );
        } else {
             return (
                <span>
                    {/* This needs to be some kind of inline-block */}
                    {this.getModalTrigger()}
                </span>
            );
        }
    }
});


let ModalBody = React.createClass({
    propTypes: {
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
                onRequestHide: this.props.onRequestHide,
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
