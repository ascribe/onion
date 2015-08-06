'use strict';

import React from 'react';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { getLangText } from '../../utils/lang_utils.js';

let PieceListToolbarFilterWidgetFilter = React.createClass({
    propTypes: {
        // An array of either strings (which represent acl enums) or objects of the form
        //
        // {
        //      key: <acl enum>,
        //      label: <a human readable string>
        // }
        //
        filterParams: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
        filterBy: React.PropTypes.object,
        applyFilterBy: React.PropTypes.func
    },

    generateFilterByStatement(param) {
        let filterBy = this.props.filterBy;

        if(filterBy) {
            // we need hasOwnProperty since the values are all booleans
            if(filterBy.hasOwnProperty(param)) {
                filterBy[param] = !filterBy[param];

                // if the parameter is false, then we want to remove it again
                // from the list of queryParameters as this component is only about
                // which actions *CAN* be done and not what *CANNOT*
                if(!filterBy[param]) {
                    delete filterBy[param];
                }

            } else {
                filterBy[param] = true;
            }
        }

        return filterBy;
    },

    /**
     * We need overloading here to find the correct parameter of the label
     * the user is clicking on.
     */
    filterBy(param) {
        return () => {
            let filterBy = this.generateFilterByStatement(param);
            this.props.applyFilterBy(filterBy);
        };
    },

    isFilterActive() {
        let trueValuesOnly = Object.keys(this.props.filterBy).filter((acl) => acl);

        // We're hiding the star in that complicated matter so that,
        // the surrounding button is not resized up on appearance
        if(trueValuesOnly.length > 0) {
            return { visibility: 'visible'};
        } else {
            return { visibility: 'hidden' };
        }
    },

    render() {
        let filterIcon = (
            <span>
                <span className="glyphicon glyphicon-filter" aria-hidden="true"></span>
                <span style={this.isFilterActive()}>*</span>
            </span>
        );

        return (
            <DropdownButton
                title={filterIcon}
                className="ascribe-piece-list-toolbar-filter-widget">
                <li style={{'textAlign': 'center'}}>
                    <em>{getLangText('Show works that')}:</em>
                </li>
                {this.props.filterParams.map((param, i) => {
                    let label;

                    if(typeof param !== 'string') {
                        label = param.label;
                        param = param.key;
                    } else {
                        param = param;
                        label = param.split('_')[1];
                    }

                    return (
                        <MenuItem
                            key={i}
                            onClick={this.filterBy(param)}
                            className="filter-widget-item">
                            <div className="checkbox-line">
                                <span>
                                    {getLangText('I can') + ' ' + getLangText(label)}
                                </span>
                                <input
                                    readOnly
                                    type="checkbox"
                                    checked={this.props.filterBy[param]} />
                            </div>
                        </MenuItem>
                    );
                })}
            </DropdownButton>
        );
    }
});

export default PieceListToolbarFilterWidgetFilter;