'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { getLangText } from '../../utils/lang_utils.js';

let PieceListToolbarFilterWidgetFilter = React.createClass({

    render() {
        let filterIcon = <Glyphicon glyph='filter' className="filter-glyph"/>;

        return (
            <DropdownButton
                title={filterIcon}
                className="ascribe-piece-list-toolbar-filter-widget">
                <li style={{'textAlign': 'center'}}>
                    <em>{getLangText('Show Pieces that')}:</em>
                </li>
                <MenuItem eventKey='1' style={{'textAlign': 'center'}}>
                    <div className="checkbox-line">
                        <label>{getLangText('I can transfer')}<input type="checkbox" /></label>
                    </div>
                </MenuItem>
                <MenuItem eventKey='2' style={{'textAlign': 'center'}}>
                    <div className="checkbox-line">
                        <label>{getLangText('I can consign')}<input type="checkbox" /></label>
                    </div>
                </MenuItem>
            </DropdownButton>
        );
    }
});

export default PieceListToolbarFilterWidgetFilter;