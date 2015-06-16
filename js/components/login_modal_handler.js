'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayMixin from 'react-bootstrap/lib/OverlayMixin';

let LoginModalHandler = React.createClass({
  mixins: [OverlayMixin],

  getInitialState() {
    return {
      isModalOpen: true
    };
  },

  handleToggle() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  render() {
    if (!this.state.isModalOpen || !(this.props.query.login === '')) {
      return <span/>;
    }

    return (
      <Modal title='Modal heading' onRequestHide={this.handleToggle}>
        <div className='modal-body'>
          This modal is controlled by our custom trigger component.
        </div>
        <div className='modal-footer'>
          <Button onClick={this.handleToggle}>Close</Button>
        </div>
      </Modal>
    );
  }
});

export default LoginModalHandler;