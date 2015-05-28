import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';

let FormMixin = {
    getInitialState() {
        return {errors: null,
                retry: 0 // used for unique keying
                }
    },
    handleResponse(response){
        if (response.status >= 200 && response.status < 300)
                return response;
        this.handleError(response);
    },
    handleError(response){
      response.json().then((response) => this.setState({errors: response.errors,
                                                        retry: this.state.retry + 1}))
    },
    renderAlert(id){
        if (this.state.errors && id in this.state.errors) {
            return this.state.errors[id].map(function(error) {
                    let key = error + this.state.retry;
                    return <AlertDismissable error={error} key={key} />;
                }.bind(this)
            )
        }
        return <span />
    },
    renderTextInput(id, type, placeHolder, required) {
        return (
            <div className="form-group">
                {this.renderAlert(id)}
                <input className="form-control input-text-ascribe" name={id} ref={id}
                    placeholder={placeHolder} required={required} type={type} />
            </div>
        )
    },
    renderTextArea(id, placeHolder, required) {
        return (
            <div className="form-group">
                {this.renderAlert(id)}
                <textarea className="form-control input-text-ascribe textarea-ascribe-message" name={id} ref={id}
                    defaultValue={placeHolder} required={required}></textarea>
            </div>
        )
    }
};

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

export default FormMixin;