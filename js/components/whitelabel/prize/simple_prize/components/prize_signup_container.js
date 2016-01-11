'use strict';

import React from 'react';
import SignupForm from '../../../../ascribe_forms/form_signup';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';

let SignupContainer = React.createClass({
    propTypes: {
        // Provided from PrizeApp
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
        const { location } = this.props;
        const { message, submitted } = this.state;
        setDocumentTitle(getLangText('Sign up'));

        if (submitted) {
            return (
                <div className="ascribe-login-wrapper">
                    <div className="ascribe-login-text ascribe-login-header">
                        {message}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ascribe-login-wrapper">
                    <SignupForm
                        headerMessage={getLangText('Create account for submission')}
                        submitMessage={getLangText('Sign up')}
                        handleSuccess={this.handleSuccess}
                        location={location} />
                </div>
            );
        }
    }
});


export default SignupContainer;
