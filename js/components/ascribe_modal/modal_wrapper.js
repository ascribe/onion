'use strict';

import React from 'react';

import Modal from 'react-bootstrap/lib/Modal';

let ModalWrapper = React.createClass({
    propTypes: {
        trigger: React.PropTypes.element,
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

    handleSuccess(response) {
        this.props.handleSuccess(response);
        this.hide();
    },

    renderChildren() {
        return React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                handleSuccess: (response) => {
                    if (typeof child.props.handleSuccess === 'function') {
                        child.props.handleSuccess(response);
                    }

                    this.handleSuccess(response);
                }
            });
        });
    },

    render() {
        const { trigger, title } = this.props;

        // If the trigger component exists, we add the ModalWrapper's show() as its onClick method.
        // The trigger component should, in most cases, be a button.
        const clonedTrigger = React.isValidElement(trigger) ? React.cloneElement(trigger, {onClick: this.show})
                                                            : null;
        return (
            <span>
                {clonedTrigger}
                <Modal show={this.state.showModal} onHide={this.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                    <div className="modal-body" >
                        {this.renderChildren()}
                    </div>
                </Modal>
            </span>
        );
    }
});

export default ModalWrapper;
