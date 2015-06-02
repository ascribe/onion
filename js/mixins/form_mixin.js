import React from 'react';

import AppConstants from '../constants/application_constants'
import AlertDismissable from '../components/ascribe_forms/alert'

export const FormMixin = {
    getInitialState() {
        return {
            submitted: false
            , status: null
            , errors: []
        }
    },
    submit(e) {
        e.preventDefault();
        for (var ref in this.refs){
            this.refs[ref].clearAlerts();
        }
        this.setState({submitted: true, errors: []});
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
        let submitted = false;
        if (response.status >= 200 && response.status < 300){
            this.props.handleSuccess();
            submitted = true;
        }
        else if (response.status >= 400 && response.status < 500) {
            this.handleError(response);
        }
        this.setState({submitted: submitted, status: response.status});
    },
    handleError(response){
        response.json().then((response) => this.dispatchErrors(response.errors));

    },
    dispatchErrors(errors){
        for (var input in errors){
            if (this.refs && this.refs[input] && this.refs[input].state){
                this.refs[input].setAlerts(errors[input]);
            }
            else{
                this.setState({errors: this.state.errors.concat(errors[input])});
            }
        }
    },
    getBitcoinIds(){
        return this.props.editions.map(function(edition){
            return edition.bitcoin_id
        })
    },
    getTitlesString(){
        return this.props.editions.map(function(edition){
            return '- \"' + edition.title + ', edition ' + edition.edition_number + '\"\n'
        })
    },
    render(){
        let alert = null;
        if (this.state.status >= 500){
            alert = <AlertDismissable error="Something went wrong, please try again later"/>;
        }
        if (this.state.errors.length > 0){
            alert = this.state.errors.map(
                        function(error) {
                            return <AlertDismissable error={error} key={error}/>;
                        }.bind(this)
                    );
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

