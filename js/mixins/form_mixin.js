import fetch from '../utils/fetch';
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
        this.setState({submitted: true});
        fetch
            .post(this.url(), { body: this.getFormData() })
            .then(response => { this.props.onRequestHide(); })
            .catch(this.handleError);
    },

    handleError(err){
        if (err.json) {
            for (var input in errors){
                if (this.refs && this.refs[input] && this.refs[input].state) {
                    this.refs[input].setAlerts(errors[input]);
                } else {
                    this.setState({errors: this.state.errors.concat(errors[input])});
                }
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

