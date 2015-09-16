'use strict';

import React from 'react';

import { getLangText } from '../utils/lang_utils';


let PieceListFilterDisplay = React.createClass({
    propTypes: {
        filterBy: React.PropTypes.object,
        filterParams: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                items: React.PropTypes.array
            })
        )
    },

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
                            value: filterBy[item.key] ? filterBy[item.key] : false
                        };
                    } else {
                        return {
                            key: item,
                            label: item.split('acl_')[1].replace(/_/g, ' '),
                            value: filterBy[item] ? filterBy[item] : false
                        }
                    }
                })
            }
        });
    },

    getFilterText(filtersWithLabel) {
        let filterTextList = filtersWithLabel
            .map((filterWithLabel) => {
                let activeFilterWithLabel = filterWithLabel
                    .items
                    .map((filter) => {
                        if(filter.value) {
                            return filter.label;
                        }
                    })
                    .filter((filterName) => !!filterName)
                    .join(', ');

                if(activeFilterWithLabel) {
                    return filterWithLabel.label + ': ' + activeFilterWithLabel
                }
            })
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