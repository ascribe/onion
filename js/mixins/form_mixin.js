import React from 'react';

import AppConstants from '../constants/application_constants'
import AlertDismissable from '../components/ascribe_forms/alert'

export const FormMixin = {
    getInitialState() {
        return {
            submitted: false
            , status: null
        }
    },
    submit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        fetch(this.url(), {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.getFormData())
        })
            .then(
            (response) => this.handleResponse(response)
        );
    },
    handleResponse(response){
        if (response.status >= 200 && response.status < 300){
            this.props.onRequestHide();
        }
        else if (response.status >= 400 && response.status < 500) {
            this.handleError(response);
        }
        else {
            this.setState({submitted: false, status: response.status});
        }
    },
    handleError(response){
        response.json().then((response) => this.dispatchErrors(response.errors));

    },
    dispatchErrors(errors){
        for (var input in errors){
            if (this.refs && this.refs[input] && this.refs[input].state){
                this.refs[input].setAlerts(errors[input]);
            }
        }
        this.setState({submitted: false});
    },
    render(){
        let alert = null;
        if (this.state.status >= 500){
            alert = <AlertDismissable error="Something went wrong, please try again later"/>;
        }
        return (
            <div>
                {alert}
                {this.renderForm()}
            </div>
        )
    }
};

export default FormMixin;

