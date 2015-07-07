'use strict';

import React from 'react';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

let PieceListToolbar = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        searchFor: React.PropTypes.func
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
                            <span className="pull-right search-bar">
                                <Input
                                    type='text'
                                    ref="search"
                                    placeholder="Search..."
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