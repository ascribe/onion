'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

import Modal from 'react-bootstrap/lib/Modal';

let ModalWrapper = React.createClass({
    propTypes: {
        trigger: React.PropTypes.element.isRequired,
        title: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return {
            showModal: false
        };
    },

    show() {
        this.setState({
            showModal: true
        });
    },

    hide() {
        this.setState({
            showModal: false
        });
    },

    handleSuccess(response){
        this.props.handleSuccess(response);
        this.hide();
    },

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child) => {
            return ReactAddons.addons.cloneWithProps(child, {
                onRequestHide: this.hide,
                handleSuccess: this.handleSuccess
            });
        });
    },

    render() {
        let trigger = React.cloneElement(this.props.trigger, {onClick: this.show});

        return (
            <span>
                {trigger}
                <Modal show={this.state.showModal} onHide={this.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">
                        {this.renderChildren()}
                    </div>
                </Modal>
            </span>
        );
    }
});

export default ModalWrapper;
