/**
 *
 */

'use strict';

import React from 'react';
import _Button from 'react-bootstrap/lib/Button';
import classnames from 'classnames';


const DISABLED_STATUSES = ['loading', 'disabled'];


function ButtonFactory(btnClassName) {

    let GenericButton = React.createClass({
        propTypes: {
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
                <_Button bsStyle={btnClassName} className={classnames(className)} disabled={disabled}>
                    {this.props.children}
                </_Button>
            );
        }

    });

    return GenericButton;
}


export const Button = ButtonFactory('btn-primary');
export const SecondaryButton = ButtonFactory('btn-secondary');
export const DangerButton = ButtonFactory('btn-danger');
