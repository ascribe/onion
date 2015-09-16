'use strict';

import React from 'react';

import { getLangText } from '../utils/lang_utils';


let PieceListFilterDisplay = React.createClass({
    propTypes: {
        filterBy: React.PropTypes.string
    },

    getFilterText() {
        let { filterBy } = this.props;
        let filterText = '';

        filterText += getLangText('Showing works that I can: ')
        // take every filter, split it on acl_ and join the resulting array as a comma separated list
        filterText += Object.keys(filterBy).map((filter) => filter.split('acl_')[1]).join(', ');

        // there are acls, like acl_create_editions that still have underscores in them,
        // therefore we need to replace all underscores with spaces
        return filterText.replace(/_/g, ' ');
    },

    render() {
        let { filterBy } = this.props;

        // do not show the FilterDisplay if there are no filters applied
        if(filterBy && Object.keys(filterBy).length === 0) {
            return null;
        } else {
            return (
                <div className="row">
                    <div className="ascribe-piece-list-filter-display col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                        {this.getFilterText()}
                        <hr />
                    </div>
                </div>
            );
        }
    }
});

export default PieceListFilterDisplay;