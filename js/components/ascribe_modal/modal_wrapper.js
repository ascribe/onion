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
        ]),
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
                handleSuccess: this.handleSuccess
            });
        });
    },

    render() {
        // this adds the onClick method show of modal_wrapper to the trigger component
        // which is in most cases a button.
        let trigger = React.cloneElement(this.props.trigger, {onClick: this.show});
        let modalHeaderAscribe = {
            paddingTop: '15px',
            paddingBottom: '0px',
            borderBottom: 'none',
            minHeight: '16.42857px'
        };
        let modalBodyAscribe = {
            paddingTop: '5px',
            paddingBottom: '10px',
            paddingRight: '15px',
            paddingLeft: '15px',
            position: 'relative'
        };
        return (
            <span>
                {trigger}
                <Modal show={this.state.showModal} onHide={this.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
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
