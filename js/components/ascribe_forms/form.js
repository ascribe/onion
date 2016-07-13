import React from 'react';
import classNames from 'classnames';

import Button from 'ascribe-react-components/es6/buttons/button';

import ApiForm from 'ascribe-react-components/es6/form/api_form';
import CollapsibleCheckboxProperty from 'ascribe-react-components/es6/form/properties/collapsible_checkbox_property';

import { createFormForPropertyTypes } from 'react-utility-belt/es6/form/form';
import formSpecExtender from 'react-utility-belt/es6/form/utils/form_spec_extender';
import Property from 'react-utility-belt/es6/form/properties/property';
import { objectOnlyArrayValue } from 'react-utility-belt/es6/prop_types';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AlertDismissable from '../alert_dismissable';
import AscribeSpinner from '../ascribe_spinner';

import { safeInvoke, sanitize } from '../../utils/general';
import { getLangText } from '../../utils/lang';


const { bool, func, string } = React.PropTypes;

const BaseForm = createFormForPropertyTypes([Property, CollapsibleCheckboxProperty]);
const ApifiedForm = ApiForm(BaseForm);

const Form = React.createClass(formSpecExtender({
    propTypes: {
        url: string.isRequired, // Required for ApiForm

        buttonText: string,
        className: string,

        /**
         * Errors to display.
         *
         * Must be an object whose keys contain only arrays of errors. See react-utility-belt's Form
         * for how it should be structured.
         */
        errors: objectOnlyArrayValue,

        // For ApiForm
        onSubmitError: func,
        onValidationError: func,

        /**
         * If enabled, show respective errors as a global notification instead of passing them down
         * to the backing Form or child Properties
         */
        showFormErrorsAsNotification: bool,
        showPropertyErrorsAsNotification: bool

        // All other props are passed to the backing Form
    },

    getDefaultProp() {
        return {
            buttonText: getLangText('SAVE'),
            // By default, display all validation errors on their properties
            onValidationError: this.defaultOnValidationError,

            renderFormErrors: this.defaultRenderFormErrors
        };
    },

    getInitialState() {
        return {
            errors: {}
        };
    },

    createErrorMessage: (errorProp) => {
        switch (errorProp) {
            case 'min' || 'max':
                return getLangText('The value you defined is not in the valid range');
            case 'pattern':
                return getLangText('The value you defined is not matching the valid pattern');
            case 'required':
                return getLangText('This field is required');
            default:
                return null;
        }
    },

    defaultOnValidationError(validationErrors) {
        // Create useful messages based on the validation prop that failed for each error
        const errors = Object.entries(validationErrors)
            .reduce((propertyErrors, [name, validationProp]) => {
                const errorMsg = this.createErrorMessage(validationProp);
                if (errorMsg) {
                    propertyErrors[name] = [errorMsg];
                }

                return propertyErrors;
            }, {});

        this.setState({ errors });
    },

    onSubmitError(err, ...args) {
        const {
            onSubmitError,
            showFormErrorsAsNotification,
            showPropertyErrorsAsNotification
        } = this.props;

        // Strip out any fields that are password related before logging
        const formData = sanitize(
            this.refs.form.getData(),
            (value, name) => !name.includes('password')
        );
        console.logGlobal(err, formData);

        if (err.json && err.json.errors) {
            // Form validation failed server-side
            if (showPropertyErrorsAsNotification) {
                // This could be made better, ie. it could delegate to a callback to construct the
                // message so the error is more descriptive.
                Object.values(err.json.errors).forEach((error) => {
                    // Only use the first error if there's multiple for the Property
                    const errorMsg = Array.isArray(error) ? error[0] : error;

                    const notification = new GlobalNotificationModel(errorMsg, 'danger');
                    GlobalNotificationActions.appendGlobalNotification(notification);
                });
            } else {
                // Make sure all error entries arrays before passing them down
                const errors = Object.entries(err.json.errors)
                    .reduce((arrayifiedErrors, [name, errorVal]) => {
                        if (errorVal) {
                            arrayifiedErrors[name] = Array.isArray(errorVal) ? errorVal
                                                                             : [errorVal];
                        }

                        return arrayifiedErrors;
                    }, {});

                this.setState({ errors });
            }
        } else {
            // Something else happened
            const errMsg = getLangText('Oops, something went wrong on our side. Please try again or ' +
                                       'contact us if the problem persists.');

            if (showFormErrorsAsNotification) {
                const notification = new GlobalNotificationModel(errMsg, 'danger');
                GlobalNotificationActions.appendGlobalNotification(notification);
            } else {
                this.setState({
                    errors: {
                        form: [errMsg]
                    }
                });
            }
        }

        const { invoked, result } = safeInvoke(onSubmitError, err, ...args);
        return invoked ? result : err;
    },

    onSubmitRequest() {
        // Reset any old errors if we passed validation and are about to submit
        this.setState({
            errors: {}
        });
    },

    defaultRenderFormErrors(errors) {
        return errors.map((error) => (
            <AlertDismissable error={error} key={error} />
        ));
    },

    render() {
        const {
            buttonText,
            className,
            errors: propErrors,
            showFormErrorsAsNotification: ignoredShowFormErrorsAsNotification, // ignored
            showPropertyErrorsAsNotification: ignoredShowPropertyErrorsAsNotification, // ignored
            ...props
        } = this.props;
        const { errors: stateErrors } = this.state;

        // FIXME: Use deep-merge instead, making sure to factor in that if a key's value is not an
        // array, it should be merged as an array
        const errors = Object.assign({}, propErrors, stateErrors);

        const buttonDefault = (
            <Button wide type="submit">
                {buttonText}
            </Button>
        );

        const buttonSubmitting = (
            <Button disabled wide type="button">
                <AscribeSpinner color="dark-blue" size="md" />
            </Button>
        );

        return (
            <ApifiedForm
                ref="form"
                {...props}
                buttonDefault={buttonDefault}
                buttonSubmitting={buttonSubmitting}
                className={classNames('ascribe-form', className)}
                errors={errors}
                errorType={AlertDismissable}
                onSubmitError={this.onSubmitError}
                onSubmitRequest={this.onSubmitRequest}
                onValidationError={this.onValidationError} />
        );
    }
}));

export default Form;
