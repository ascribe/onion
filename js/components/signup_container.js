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

        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return {
            submitted: false,
            message: null
        };
    },

    handleSuccess(message) {
        this.setState({
            submitted: true,
            message: message
        });
    },

    render() {
        const { location,
                whitelabel: { name: whitelabelName } } = this.props;
        const { message, submitted } = this.state;

        setDocumentTitle(getLangText('Sign up'));

        if (submitted) {
            return (
                <div className="ascribe-login-wrapper">
                    <br/>
                    <div className="ascribe-login-text ascribe-login-header">
                        {message}
                    </div>
                </div>
            );
        }
        return (
            <div className="ascribe-login-wrapper">
                <SignupForm
                    handleSuccess={this.handleSuccess}
                    whitelabelName={whitelabelName}
                    location={location}/>
                <div className="ascribe-login-text">
                    {getLangText(`Already a ${whitelabelName || 'ascribe'} user`)}&#63; <Link to="/login">{getLangText('Log in')}...</Link><br/><br/>

                    We don't collect or use any data about you. The only thing we record are your artwork registrations and transactions with other users. We will only use your email to send you important updates and you can change your mind at anytime by clicking the unsubscribe link of any email you receive from us, or by requesting your data to be deleted via <a href="mailto:gdpr@ascribe.io">gdpr@ascribe.io</a>. For further information, visit our <a href="https://www.ascribe.io/privacy/">Privacy Policy</a>.<br/><br/>
                    BigchainDB GmbH<br/>
                    Chausseestraße 19<br/>
                    Berlin 10115<br/>
                    Germany
                </div>
            </div>

        );
    }
});


export default SignupContainer;
