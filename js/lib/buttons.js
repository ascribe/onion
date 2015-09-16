/**
 *
 */

'use strict';

import React from 'react';
import _Button from 'react-bootstrap/lib/Button';
import classnames from 'classnames';


const DISABLED_STATUSES = ['loading', 'disabled'];


function ButtonFactory(style, btnClassName, options) {

    style = style || 'default';
    options = options || {};

    let GenericButton = React.createClass({
        propTypes: {
            onClick: React.PropTypes.func,
            status: React.PropTypes.oneOf(['loading', 'disabled']),
            children: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.element),
                                                 React.PropTypes.element])
        },

        getInitialState: function() {
            return {
                status: this.props.status
            };
        },

        render: function render() {
            let disabled = DISABLED_STATUSES.indexOf(this.state.status) !== -1;
            let className = '';

            if (this.state.status !== 'disabled') {
                className = this.state.status;
            }

            return (
                <_Button bsStyle={style} onClick={this.props.onClick} className={classnames(btnClassName, className)} type={options.type} disabled={disabled}>
                    {this.props.children}
                </_Button>
            );
        }

    });

    return GenericButton;
}


export const Button = ButtonFactory('primary', 'btn-primary');
export const SubmitButton = ButtonFactory('primary', 'btn-primary', { type: 'submit' });
export const SecondaryButton = ButtonFactory('default', 'btn-secondary');
export const DangerButton = ButtonFactory('danger', 'btn-danger');
