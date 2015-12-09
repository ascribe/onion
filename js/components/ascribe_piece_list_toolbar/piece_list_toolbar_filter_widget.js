'use strict';

import React from 'react';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import { getLangText } from '../../utils/lang_utils.js';


let PieceListToolbarFilterWidget = React.createClass({
    propTypes: {
        filterParams: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                items: React.PropTypes.arrayOf(
                    React.PropTypes.oneOfType([
                        React.PropTypes.string,
                        React.PropTypes.shape({
                            key: React.PropTypes.string,
                            label: React.PropTypes.string
                        })
                    ])
                )
            })
        ).isRequired,
        filterBy: React.PropTypes.object,
        applyFilterBy: React.PropTypes.func
    },

    generateFilterByStatement(param) {
        const filterBy = Object.assign({}, this.props.filterBy);

        if (filterBy) {
            // we need hasOwnProperty since the values are all booleans
            if (filterBy.hasOwnProperty(param)) {
                filterBy[param] = !filterBy[param];

                // if the parameter is false, then we want to remove it again
                // from the list of queryParameters as this component is only about
                // which actions *CAN* be done and not what *CANNOT*
                if (!filterBy[param]) {
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
            const filterBy = this.generateFilterByStatement(param);
            this.props.applyFilterBy(filterBy);
        };
    },

    isFilterActive() {
        const trueValuesOnly = Object.keys(this.props.filterBy).filter((acl) => acl);

        // We're hiding the star in that complicated matter so that,
        // the surrounding button is not resized up on appearance
        if (trueValuesOnly.length) {
            return { visibility: 'visible'};
        } else {
            return { visibility: 'hidden' };
        }
    },

    render() {
        const filterIcon = (
            <span>
                <span className="ascribe-icon icon-ascribe-filter" aria-hidden="true"></span>
                <span style={this.isFilterActive()}>*</span>
            </span>
        );

        if (this.props.filterParams && this.props.filterParams.length) {
            return (
                <DropdownButton
                    pullRight={true}
                    title={filterIcon}
                    className="ascribe-piece-list-toolbar-filter-widget">
                    {/* We iterate over filterParams, to receive the label and then for each
                        label also iterate over its items, to get all filterable options */}
                    {this.props.filterParams.map(({ label, items }, i) => {
                        return (
                            <div>
                                <li
                                    style={{'textAlign': 'center'}}
                                    key={i}>
                                    <em>{label}:</em>
                                </li>
                                {items.map((param, j) => {

                                    // As can be seen in the PropTypes, a param can either
                                    // be a string or an object of the shape:
                                    //
                                    // {
                                    //     key: <String>,
                                    //     label: <String>
                                    // }
                                    //
                                    // This is why we need to distinguish between both here.
                                    if (typeof param !== 'string') {
                                        label = param.label;
                                        param = param.key;
                                    } else {
                                        param = param;
                                        label = param.split('acl_')[1].replace(/_/g, ' ');
                                    }

                                    return (
                                        <li
                                            key={j}
                                            onClick={this.filterBy(param)}
                                            className="filter-widget-item">
                                            <div className="checkbox-line">
                                                <span>
                                                    {getLangText(label)}
                                                </span>
                                                <input
                                                    readOnly
                                                    type="checkbox"
                                                    checked={this.props.filterBy[param]} />
                                            </div>
                                        </li>
                                    );
                                })}
                            </div>
                        );
                    })}
                </DropdownButton>
            );
        } else {
            return null;
        }
    }
});

export default PieceListToolbarFilterWidget;
