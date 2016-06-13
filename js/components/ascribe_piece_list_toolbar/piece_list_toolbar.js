'use strict';

import React from 'react';
import classNames from 'classnames';

import PieceListToolbarFilterWidget from './piece_list_toolbar_filter_widget';
import PieceListToolbarOrderWidget from './piece_list_toolbar_order_widget';
import SearchBar from '../search_bar';

import AppConstants from '../../constants/application_constants';


let PieceListToolbar = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        searchFor: React.PropTypes.func,
        searchQuery: React.PropTypes.string,
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
        ),
        filterBy: React.PropTypes.object,
        applyFilterBy: React.PropTypes.func,
        orderParams: React.PropTypes.array,
        orderBy: React.PropTypes.string,
        applyOrderBy: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        const { className, children, searchFor, searchQuery } = this.props;

        return (
            <div className={classNames('row', className)}>
                <div className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 ascribe-piece-list-toolbar">
                    <span className="pull-left">
                        {children}
                    </span>
                    <span className="pull-right">
                        <PieceListToolbarOrderWidget
                            orderParams={this.props.orderParams}
                            orderBy={this.props.orderBy}
                            applyOrderBy={this.props.applyOrderBy}/>
                        <PieceListToolbarFilterWidget
                            filterParams={this.props.filterParams}
                            filterBy={this.props.filterBy}
                            applyFilterBy={this.props.applyFilterBy} />
                    </span>
                    <SearchBar
                        className="pull-right search-bar ascribe-input-glyph"
                        searchFor={searchFor}
                        searchQuery={searchQuery}
                        threshold={AppConstants.searchThreshold}/>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;
