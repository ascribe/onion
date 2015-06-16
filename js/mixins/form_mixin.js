'use strict';

import fetch from '../utils/fetch';
import React from 'react';

import AlertDismissable from '../components/ascribe_forms/alert';

export const FormMixin = {
    propTypes: {
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object
    },

    getInitialState() {
        return {
            submitted: false,
            errors: []
        };
    },

    submit(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({submitted: true});
        this.clearErrors();
        let action = (this.httpVerb && this.httpVerb()) || 'post';
        this[action](e);
    },

    post(e){
        fetch
            .post(this.url(e), { body: this.getFormData() })
            .then(this.handleSuccess)
            .catch(this.handleError);
    },

    delete(e){
        fetch
            .delete(this.url(e))
            .then(this.handleSuccess)
            .catch(this.handleError);
    },
    
    clearErrors(){
        for (var ref in this.refs){
            if ('clearAlerts' in this.refs[ref]){
                this.refs[ref].clearAlerts();
            }

        }
        this.setState({errors: []});
    },
    handleSuccess(response){
        if ('handleSuccess' in this.props){
            this.props.handleSuccess(response);
        }

    },
    handleError(err){
        if (err.json) {
            for (var input in err.json.errors){
                if (this.refs && this.refs[input] && this.refs[input].state) {
                    this.refs[input].setAlerts( err.json.errors[input]);
                } else {
                    this.setState({errors: this.state.errors.concat(err.json.errors[input])});
                }
            }
        }
        else {
            this.setState({errors: ['Something went wrong, please try again later']});
        }
        this.setState({submitted: false});
    },

    getBitcoinIds(){
        return this.props.editions.map(function(edition){
            return edition.bitcoin_id;
        });
    },
    
    getTitlesString(){
        return this.props.editions.map(function(edition){
            return '- \"' + edition.title + ', edition ' + edition.edition_number + '\"\n';
        });
    },

    render(){
        let alert = null;
        if (this.state.errors.length > 0){
            alert = this.state.errors.map((error) => {
                return <AlertDismissable error={error} key={error}/>;
            });
        }
        
        return (
            <div>
                {alert}
                {this.renderForm()}
            </div>
        );
    }
};

export default FormMixin;

