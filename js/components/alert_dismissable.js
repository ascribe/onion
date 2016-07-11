import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';


const { node } = React.PropTypes;

const AlertDismissable = React.createClass({
    propTypes: {
        error: node.isRequired
    },

    getInitialState() {
        return {
            alertVisible: true
        };
    },

    show() {
        this.setState({ alertVisible: true });
    },

    hide() {
        this.setState({ alertVisible: false });
    },

    render() {
        const { error } = this.props;
        const { alertVisible } = this.state;

        return alertVisible ? (
            <Alert bsStyle='danger' onDismiss={this.hide}>
                {error}
            </Alert>
        ) : null;
    }
});

export default AlertDismissable;
