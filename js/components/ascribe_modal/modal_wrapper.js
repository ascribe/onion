'use strict';

import React from 'react';
import classNames from 'classnames';

import Modal from 'react-bootstrap/lib/Modal';

let ModalWrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired,
        title: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired,

        bodyClassNames: React.PropTypes.string,
        handleCancel: React.PropTypes.func,
        handleSuccess: React.PropTypes.func,
        trigger: React.PropTypes.element
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

    handleCancel() {
        if (typeof this.props.handleCancel === 'function') {
            this.props.handleCancel();
        }

        this.hide();
    },

    handleSuccess(response) {
        if (typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess(response);
        }

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
        const { bodyClassNames, trigger, title } = this.props;

        // If the trigger component exists, we add the ModalWrapper's show() to its onClick method.
        // The trigger component should, in most cases, be a button.
        const clonedTrigger = React.isValidElement(trigger) ?
            React.cloneElement(trigger, {
                onClick: (...params) => {
                    if (typeof trigger.props.onClick === 'function') {
                        trigger.props.onClick(...params);
                    }

                    this.show();
                }
            }) : null;

        return (
            <span>
                {clonedTrigger}
                <Modal
                    onHide={this.handleCancel}
                    show={this.state.showModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                    <div className={classNames('modal-body', bodyClassNames)}>
                        {this.renderChildren()}
                    </div>
                </Modal>
            </span>
        );
    }
});

export default ModalWrapper;
