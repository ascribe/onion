import React from 'react';
import _Button from 'react-bootstrap/lib/Button';

export const Button = React.createClass({

    render: function render() {
        return (
            <_Button>
                {this.props.children}
            </_Button>
        )
    }

});


export const SecondaryButton = React.createClass({

    render: function render() {
        return (
            <_Button className='btn-secondary'>
                {this.props.children}
            </_Button>
        )
    }

});
