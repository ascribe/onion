'use strict';

import React from 'react';

import PieceListToolbarFilterWidget from './piece_list_toolbar_filter_widget';
import PieceListToolbarOrderWidget from './piece_list_toolbar_order_widget';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { getLangText } from '../../utils/lang_utils';

let PieceListToolbar = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        searchFor: React.PropTypes.func,
        filterParams: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                items: React.PropTypes.array
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

    searchFor() {
         let searchTerm = this.refs.search.getInputDOMNode().value;
         this.props.searchFor(searchTerm);
    },

    getFilterWidget(){
        if (this.props.filterParams){
            return (
                <PieceListToolbarFilterWidget
                    filterParams={this.props.filterParams}
                    filterBy={this.props.filterBy}
                    applyFilterBy={this.props.applyFilterBy} />
            );
        }
        return null;
    },
    getOrderWidget(){
        if (this.props.orderParams){
            return (
                <PieceListToolbarOrderWidget
                    orderParams={this.props.orderParams}
                    orderBy={this.props.orderBy}
                    applyOrderBy={this.props.applyOrderBy}/>
            );
        }
        return null;
    },

    render() {
        let searchIcon = <Glyphicon glyph='search' className="filter-glyph"/>;

        return (
            <div className={this.props.className}>
                <div className="row">
                    <div className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                        <div className="row">
                            <span className="pull-left">
                                {this.props.children}
                            </span>
                            <span className="pull-right search-bar ascribe-input-glyph">
                                <Input
                                    type='text'
                                    ref="search"
                                    placeholder={getLangText('Search%s', '...')}
                                    onChange={this.searchFor}
                                    addonAfter={searchIcon} />
                            </span>
                            <span className="pull-right">
                                {this.getOrderWidget()}
                                {this.getFilterWidget()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;
