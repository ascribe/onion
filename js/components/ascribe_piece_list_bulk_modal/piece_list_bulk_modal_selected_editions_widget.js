'use strict';

import React from 'react';
import { getLangText } from '../../utils/lang_utils.js';

let PieceListBulkModalSelectedEditionsWidget = React.createClass({
    propTypes: {
        numberOfSelectedEditions: React.PropTypes.number.isRequired
    },

    render() {
        return (
            <span className={this.props.numberOfSelectedEditions < 1 ? getLangText('hidden') : ''}>
                {this.props.numberOfSelectedEditions} {getLangText('Editions selected')}
            </span>
        );
    }
});

export default PieceListBulkModalSelectedEditionsWidget;