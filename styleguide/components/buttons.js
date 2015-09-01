'use strict';

import React from 'react';

let Buttons = React.createClass({
    render() {
        let classes = [
            'btn btn-default',
            'btn ascribe-btn',
            'btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner',
            'btn btn-danger btn-delete btn-sm'
        ];

        return (
            <div>
            {classes.map((c) => {
                return (
                    <span className={c}>
                        {c}
                    </span>
                );
                })
            }
            </div>
        );
    }

});

export default Buttons;
