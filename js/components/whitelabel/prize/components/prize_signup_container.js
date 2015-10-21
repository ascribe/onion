'use strict';

import React from 'react';
import SignupForm from '../../../ascribe_forms/form_signup';

import { getLangText } from '../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../utils/dom_utils';

let SignupContainer = React.createClass({
    propTypes: {
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

        if (this.state.submitted){
            return (
                <div className="ascribe-login-wrapper">
                    <div className="ascribe-login-text ascribe-login-header">
                        {this.state.message}
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
                        location={this.props.location}/>
                </div>
            );
        }
    }
});


export default SignupContainer;
