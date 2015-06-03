import React from 'react';

import AlertMixin from '../../mixins/alert_mixin'

let InputTextArea = React.createClass({

    mixins : [AlertMixin],

    getInitialState() {
        return {value: this.props.defaultValue,
                alerts: null // needed in AlertMixin
        };
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    render() {
        let className = "form-control input-text-ascribe textarea-ascribe-message";

        let alerts = (this.props.submitted) ? null : this.state.alerts;
        return (
            <div className="form-group">
                {alerts}
                <textarea className={className}
                    defaultValue={this.props.defaultValue}
                    required={this.props.required}
                    onChange={this.handleChange}></textarea>
            </div>
        );
    }
});

export default InputTextArea;