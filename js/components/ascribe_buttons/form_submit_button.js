'use strict';

import React from 'react/addons';

const { string, object } = React.PropTypes;

/**
 * Originally, this button was introduced for `RegisterPieceForm`.
 * The underlying problem that lead to the implementation was that multiple `InputFineuploader`s
 * where displayed in one form.
 * For the form's submit button always to represent an applicable state we had to save
 * the ready states of the multiple uploaders in `RegisterPieceForm`.
 * However, on each invocation of `this.setState`, we were re-rendering the form again,
 * which caused (if the user had the file-selector open) a detachment between user input and
 * displayed page.
 *
 * This button helps to outsource the state of the form's readiness to another component,
 * to solve the problem.
 */
const FormSubmitButton = React.createClass({
    propTypes: {
        defaultReadyStates: object.isRequired,
        label: string.isRequired
    },

    getInitialState() {
        return {
            readyStates: this.props.defaultReadyStates
        };
    },

    setReadyStateForKey(key, state) {
        const readyStates = React.addons.update(this.state.readyStates, { [key]: { $set: state } });
        this.setState({ readyStates });
    },

    render() {
        const { label } = this.props;
        const { readyStates } = this.state;

        // Reduce all readyStates to a single boolean
        const ready = Object.keys(readyStates)
                            .reduce((defaultState, stateKey) => {
                                return defaultState && readyStates[stateKey];
                            }, true);

        return (
            <button
                type="submit"
                className="btn btn-default btn-wide"
                disabled={!ready}>
                {label}
            </button>
        );
    }
});

export default FormSubmitButton;