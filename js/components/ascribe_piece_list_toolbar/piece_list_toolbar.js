'use strict';

import React from 'react';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { getLangText } from '../../utils/lang_utils';

let PieceListToolbar = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        searchFor: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    searchFor() {
         let searchTerm = this.refs.search.getInputDOMNode().value;
         this.props.searchFor(searchTerm);
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
                            <span className="pull-right search-bar">
                                <Input
                                    type='text'
                                    ref="search"
                                    placeholder={getLangText('Search%s', '...')}
                                    onChange={this.searchFor}
                                    addonAfter={searchIcon} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;
