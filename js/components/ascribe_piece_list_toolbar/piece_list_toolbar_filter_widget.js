'use strict';

import React from 'react';

import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { getLangText } from '../../utils/lang_utils.js';

let PieceListToolbarFilterWidgetFilter = React.createClass({
    propTypes: {
        filterParams: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    generateFilterByStatement(param) {
        let filterBy = this.state.filterBy;

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
            PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                            this.state.orderBy, this.state.orderAsc, filterBy);
        };
    },

    isFilterActive() {
        let trueValuesOnly = Object.keys(this.state.filterBy).filter((acl) => acl);

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
                    let name = param.split('_')[1];
                    return (
                        <MenuItem
                            key={i}
                            style={{'textAlign': 'center'}}>
                            <div className="checkbox-line">
                                <span onClick={this.filterBy(param)}>
                                    {getLangText('I can') + ' ' + getLangText(name)}
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterBy[param]} />
                                </span>
                            </div>
                        </MenuItem>
                    );
                })}
            </DropdownButton>
        );
    }
});

export default PieceListToolbarFilterWidgetFilter;