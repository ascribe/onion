'use strict';

import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';

let AlertDismissable = React.createClass({
    getInitialState() {
        return {
            alertVisible: true
        };
    },
    
    show() {
        this.setState({alertVisible: true});
    },

    hide() {
        this.setState({alertVisible: false});
    },

    render() {
        if (this.state.alertVisible) {
            let key = this.props.error;
            return (
                <Alert bsStyle='danger' onDismiss={this.hide}>
                    {this.props.error}
                </Alert>
            );
        }
        return (
            <span />
        );
    }
});

export default AlertDismissable;
