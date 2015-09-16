'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

import AlertDismissable from './alert';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import requests from '../../utils/requests';

import { SubmitButton, SecondaryButton } from '../../lib/buttons';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptionsWithDuplicates } from '../../utils/general_utils';


let Form = React.createClass({
    propTypes: {
        url: React.PropTypes.string,

        method: React.PropTypes.string,

        handleSuccess: React.PropTypes.func,

        getFormData: React.PropTypes.func,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),

        className: React.PropTypes.string,

        buttons: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ]),

        buttonSubmit: React.PropTypes.oneOfType([
            React.PropTypes.string
        ]),

        buttonCancel: React.PropTypes.oneOfType([
            React.PropTypes.bool,
            React.PropTypes.string
        ]),

        showButtonsOnEdit: React.PropTypes.bool,

        // Can be used to freeze the whole form
        disabled: React.PropTypes.bool,

        // You can use the form for inline requests, like the submit click on a button.
        // For the form to then not display the error on top, you need to enable this option.
        // It will make use of the GlobalNotification
        isInline: React.PropTypes.bool,

        autoComplete: React.PropTypes.string,

        onReset: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            method: 'post',
            buttonSubmit: 'Submit',
            buttonCancel: true,
            showButtonsOnEdit: false,
            autoComplete: 'off'
        };
    },

    getInitialState() {
        return {
            edited: false,
            submitted: false,
            errors: []
        };
    },

    reset() {
        // If onReset prop is defined from outside,
        // notify component that a form reset is happening.
        if(typeof this.props.onReset === 'function') {
            this.props.onReset();
        }

        for(let ref in this.refs) {
            if(typeof this.refs[ref].reset === 'function') {
                this.refs[ref].reset();
            }
        }
        this.setState(this.getInitialState());
    },

    submit(event) {
        if(event) {
            event.preventDefault();
        }

        this.setState({submitted: true});
        this.clearErrors();

        // selecting http method based on props
        if(this[this.props.method] && typeof this[this.props.method] === 'function') {
            window.setTimeout(() => this[this.props.method](), 100);
        } else {
            throw new Error('This HTTP method is not supported by form.js (' + this.props.method + ')');
        }
    },

    post() {
        requests
            .post(this.props.url, { body: this.getFormData() })
            .then(this.handleSuccess)
            .catch(this.handleError);
    },

    put() {
        requests
            .put(this.props.url, { body: this.getFormData() })
            .then(this.handleSuccess)
            .catch(this.handleError);
    },

    patch() {
        requests
            .patch(this.props.url, { body: this.getFormData() })
            .then(this.handleSuccess)
            .catch(this.handleError);
    },

    delete() {
        requests
            .delete(this.props.url, this.getFormData())
            .then(this.handleSuccess)
            .catch(this.handleError);
    },

    getFormData() {
        let data = {};

        for(let ref in this.refs) {
            data[this.refs[ref].props.name] = this.refs[ref].state.value;
        }

        if(typeof this.props.getFormData === 'function') {
            data = mergeOptionsWithDuplicates(data, this.props.getFormData());
        }

        return data;
    },

    handleChangeChild(){
        this.setState({ edited: true });
    },

    handleSuccess(response){
        if(typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess(response);
        }

        for(let ref in this.refs) {
            if(this.refs[ref] && typeof this.refs[ref].handleSuccess === 'function'){
                this.refs[ref].handleSuccess();
            }
        }
        this.setState({
            edited: false,
            submitted: false
        });
    },

    handleError(err){
        if (err.json) {
            for (let input in err.json.errors){
                if (this.refs && this.refs[input] && this.refs[input].state) {
                    this.refs[input].setErrors(err.json.errors[input]);
                } else {
                    this.setState({errors: this.state.errors.concat(err.json.errors[input])});
                }
            }
        } else {
            let formData = this.getFormData();

            // sentry shouldn't post the user's password
            if(formData.password) {
                delete formData.password;
            }

            console.logGlobal(err, false, formData);

            if(this.props.isInline) {
                let notification = new GlobalNotificationModel(getLangText('Something went wrong, please try again later'), 'danger');
                GlobalNotificationActions.appendGlobalNotification(notification);
            } else {
                this.setState({errors: [getLangText('Something went wrong, please try again later')]});
            }

        }
        this.setState({submitted: false});
    },

    clearErrors(){
        for(let ref in this.refs){
            if (this.refs[ref] && typeof this.refs[ref].clearErrors === 'function'){
                this.refs[ref].clearErrors();
            }
        }
        this.setState({errors: []});
    },

    getButtons() {
        let submit = this.props.buttonSubmit;
        let cancel = this.props.buttonCancel;
        let buttons = null;

        submit = (
            <SubmitButton>{submit}</SubmitButton>
        );

        // cancel can be true if we want the button, false
        // or null if we don't want it. If cancel is a string then
        // the string itself is used as the label of the button
        if (cancel === true) {
            cancel = getLangText('Cancel');
        } else if (cancel === false || cancel === null) {
            cancel = null;
        }
        if (typeof cancel === 'string') {
            cancel = (
                <SecondaryButton onClick={this.reset}>{cancel}</SecondaryButton>
            );
        }

        buttons = (
            <div className="footer">
                {submit}
                {cancel}
            </div>
        );

        if (this.props.showButtonsOnEdit && !this.state.edited ) {
            return null;
        }

        return buttons;
    },

    getErrors() {
        let errors = null;
        if (this.state.errors.length > 0){
            errors = this.state.errors.map((error) => {
                return <AlertDismissable error={error} key={error}/>;
            });
        }
        return errors;
    },

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child) => {
            if (child) {
                return ReactAddons.addons.cloneWithProps(child, {
                    handleChange: this.handleChangeChild,
                    ref: child.props.name,

                    // We need this in order to make editable be overridable when setting it directly
                    // on Property
                    editable: child.props.overrideForm ? child.props.editable : !this.props.disabled
                });
            }
        });
    },

    /**
     * All webkit-based browsers are ignoring the attribute autoComplete="off",
     * as stated here: http://stackoverflow.com/questions/15738259/disabling-chrome-autofill/15917221#15917221
     * So what we actually have to do is depended on whether or not this.props.autoComplete is set to "on" or "off"
     * insert two fake hidden inputs that mock password and username so that chrome/safari is filling those
     */
    getFakeAutocompletableInputs() {
        if(this.props.autoComplete === 'off') {
            return (
                <span>
                    <input style={{display: 'none'}} type="text" name="fakeusernameremembered"/>
                    <input style={{display: 'none'}} type="password" name="fakepasswordremembered"/>
                </span>
            );
        } else {
            return null;
        }
    },

    render() {
        let className = 'ascribe-form';

        if(this.props.className) {
            className += ' ' + this.props.className;
        }

        return (
            <form
                role="form"
                className={className}
                onSubmit={this.submit}
                onReset={this.reset}
                autoComplete={this.props.autoComplete}>
                {this.getFakeAutocompletableInputs()}
                {this.getErrors()}
                {this.renderChildren()}

                {this.getButtons()}
            </form>

        );
    }
});


export default Form;
