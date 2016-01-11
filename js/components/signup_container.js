'use strict';

import React from 'react';
import { Link } from 'react-router';

import SignupForm from './ascribe_forms/form_signup';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let SignupContainer = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        //Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return {
            submitted: false,
            message: null
        };
    },

    handleSuccess(message){
        this.setState({
            submitted: true,
            message: message
        });
    },

    render() {
        setDocumentTitle(getLangText('Sign up'));

        if (this.state.submitted) {
            return (
                <div className="ascribe-login-wrapper">
                    <br/>
                    <div className="ascribe-login-text ascribe-login-header">
                        {this.state.message}
                    </div>
                </div>
            );
        }
        return (
            <div className="ascribe-login-wrapper">
                <SignupForm
                    handleSuccess={this.handleSuccess}
                    location={this.props.location}/>
                <div className="ascribe-login-text">
                    {getLangText('Already an ascribe user')}&#63; <Link to="/login">{getLangText('Log in')}...</Link><br/>
                </div>
            </div>

        );
    }
});


export default SignupContainer;
