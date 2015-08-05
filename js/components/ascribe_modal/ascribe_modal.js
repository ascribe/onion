'use strict';

import React from 'react';

import Modal from 'react-bootstrap/lib/Modal';

let AscribeModal = React.createClass({

    propTypes: {
        trigger: React.PropTypes.element.isRequired,
        title: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired,
        footer: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired
    },

    getInitialState(){
        return {
            modalBody: null
        };
    },

    close() {
        this.setState({ showModal: false });
    },

    open() {
        this.setState({ showModal: true });
    },

    render() {

        let trigger = React.cloneElement(this.props.trigger, {onClick: this.open});

        return (
            <span>
                {trigger}
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body ref="modalBody">
                        {this.props.children}
                    </Modal.Body>
                </Modal>
            </span>
        );
    }
});

export default AscribeModal;