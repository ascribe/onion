'use strict';

import React from 'react';


let PieceListFilterDisplay = React.createClass({
    propTypes: {
        filterBy: React.PropTypes.object,
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
        )
    },

    /**
     * Takes the above described filterParams prop,
     * assigns it it's true filterBy value that is derived from the filterBy prop
     * and also - if there wasn't already one defined - generates a label
     * @return {object}
     */
    transformFilterParamsItemsToBools() {
        let { filterParams, filterBy } = this.props;

        return filterParams.map((filterParam) => {
            return {
                label: filterParam.label,
                items: filterParam.items.map((item) => {
                    if(typeof item !== 'string' && typeof item.key === 'string' && typeof item.label === 'string') {
                        return {
                            key: item.key,
                            label: item.label,
                            value: filterBy[item.key] || false
                        };
                    } else {
                        return {
                            key: item,
                            label: item.split('acl_')[1].replace(/_/g, ' '),
                            value: filterBy[item] || false
                        };
                    }
                })
            };
        });
    },

    /**
     * Takes the list of filters generated in transformFilterParamsItemsToBools and
     * transforms them into human readable text.
     * @param  {Object} filtersWithLabel An object of the shape {key: <String>, label: <String>, value: <Bool>}
     * @return {string} A human readable string
     */
    getFilterText(filtersWithLabel) {
        let filterTextList = filtersWithLabel
            // Iterate over all provided filterLabels and generate a list
            // of human readable strings
            .map((filterWithLabel) => {
                let activeFilterWithLabel = filterWithLabel
                    .items
                    // If the filter is active (which it is when its value is true),
                    // we're going to include it's label into a list,
                    // otherwise we'll just return nothing
                    .map((filter) => {
                        if(filter.value) {
                            return filter.label;
                        }
                    })
                    // if nothing is returned, that index is 'undefined'.
                    // As we only want active filter, we filter out all falsy values e.g. undefined
                    .filter((filterName) => !!filterName)
                    // and join the result to a string
                    .join(', ');

                // If this actually didn't generate an empty string,
                // we take the label and concat it to the result.
                if(activeFilterWithLabel) {
                    return filterWithLabel.label + ': ' + activeFilterWithLabel;
                }
            })
            // filter out strings that are undefined, as their filter's were not activated
            .filter((filterText) => !!filterText)
            // if there are multiple sentences, capitalize the first one and lowercase the others
            .map((filterText, i) => i === 0 ? filterText.charAt(0).toUpperCase() + filterText.substr(1) : filterText.charAt(0).toLowerCase() + filterText.substr(1))
            .join(' and ');

        return filterTextList;
    },

    render() {
        let { filterBy } = this.props;
        let filtersWithLabel = this.transformFilterParamsItemsToBools();

        // do not show the FilterDisplay if there are no filters applied
        if(filterBy && Object.keys(filterBy).length === 0) {
            return null;
        } else {
            return (
                <div className="row">
                    <div className="ascribe-piece-list-filter-display col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                        {this.getFilterText(filtersWithLabel)}
                        <hr />
                    </div>
                </div>
            );
        }
    }
});

export default PieceListFilterDisplay;