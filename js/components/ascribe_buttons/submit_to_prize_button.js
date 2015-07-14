'use strict';

import React from 'react';
import classNames from 'classnames';

import { getLangText } from '../../utils/lang_utils';

let SubmitToPrizeButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },

    render() {
        return (
            <button
                className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                {getLangText('Submit to prize')}
                </button>
        );
    }
});

export default SubmitToPrizeButton;