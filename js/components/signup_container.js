import React from 'react';
import Link from 'react-router/es6/Link';

import SignupForm from './ascribe_forms/form_signup';

import { whitelabelShape } from './prop_types';

import { setDocumentTitle } from '../utils/dom_utils';
import { getLangText } from '../utils/lang_utils';
import { withWhitelabel } from '../utils/react_utils';


let SignupContainer = React.createClass({
    propTypes: {
        // Injected through HOCs
        whitelabel: whitelabelShape.isRequired, // eslint-disable-line react/sort-prop-types

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
        const {
            location,
            whitelabel: { name: whitelabelName }
        } = this.props;
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
                    {getLangText(`Already a ${whitelabelName || 'ascribe'} user`)}&#63; <Link to="/login">{getLangText('Log in')}...</Link><br/>
                </div>
            </div>

        );
    }
});


export default withWhitelabel(SignupContainer);
