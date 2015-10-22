'use strict';

import React from 'react';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import { getLangText } from '../../utils/lang_utils.js';

let PieceListToolbarOrderWidget = React.createClass({
    propTypes: {
        // An array of either strings (which represent acl enums) or objects of the form
        //
        // {
        //      key: <acl enum>,
        //      label: <a human readable string>
        // }
        orderParams: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
        orderBy: React.PropTypes.string,
        applyOrderBy: React.PropTypes.func
    },

    generateOrderByStatement(param) {
        let orderBy = this.props.orderBy;
        return orderBy;
    },

    /**
     * We need overloading here to find the correct parameter of the label
     * the user is clicking on.
     */
    orderBy(orderBy) {
        return () => {
            this.props.applyOrderBy(orderBy);
        };
    },

    isOrderActive() {
        // We're hiding the star in that complicated matter so that,
        // the surrounding button is not resized up on appearance
        if(this.props.orderBy.length > 0) {
            return { visibility: 'visible'};
        } else {
            return { visibility: 'hidden' };
        }
    },

    render() {
        let filterIcon = (
            <span>
                <span className="ascribe-icon icon-ascribe-sort" aria-hidden="true"></span>
                <span style={this.isOrderActive()}>&middot;</span>
            </span>
        );
        return (

            <DropdownButton
                title={filterIcon}
                className="ascribe-piece-list-toolbar-filter-widget">
                <li style={{'textAlign': 'center'}}>
                    <em>{getLangText('Sort by')}:</em>
                </li>
                {this.props.orderParams.map((param) => {
                    return (
                        <div>
                            <li
                                key={param}
                                onClick={this.orderBy(param)}
                                className="filter-widget-item">
                                <div className="checkbox-line">
                                    <span>
                                        {getLangText(param.replace('_', ' '))}
                                    </span>
                                    <input
                                        readOnly
                                        type="checkbox"
                                        checked={param.indexOf(this.props.orderBy) > -1} />
                                </div>
                            </li>
                        </div>
                    );
                })}
            </DropdownButton>
        );
    }
});

export default PieceListToolbarOrderWidget;