'use strict';

import React from 'react';
import Router from 'react-router';

import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

let Link = Router.Link;

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
        let searchIcon = <Glyphicon glyph='search' />;

        return (
            <div className={this.props.className}>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-md-5 col-lg-4 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 clear-paddings">
                                <div className="form-inline">
                                    <Input type='text' ref="search" placeholder="Search..." onChange={this.searchFor} addonAfter={searchIcon} />
                                    &nbsp;&nbsp;
                                    {/*<PieceListToolbarFilterWidgetFilter />*/}
                                    <Link to="register_piece">
                                        <Button>+ Artwork</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;