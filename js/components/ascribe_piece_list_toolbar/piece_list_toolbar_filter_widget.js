'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

let PieceListToolbarFilterWidgetFilter = React.createClass({
    render() {
        let filterIcon = <Glyphicon glyph='filter' />;

        return (
            <DropdownButton title={filterIcon}>
                <li style={{'textAlign': 'center'}}>
                    <em>Show Pieces that:</em>
                </li>
                <MenuItem eventKey='1'>
                    <div className="checkbox">
                        I can transfer <input type="checkbox" />
                    </div>
                </MenuItem>
                <MenuItem eventKey='2'>
                    <div className="checkbox">
                        I can consign <input type="checkbox" />
                    </div>
                </MenuItem>
            </DropdownButton>
        );
    }
});

export default PieceListToolbarFilterWidgetFilter;