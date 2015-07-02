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
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="col-xs-12 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 clear-paddings">
                                <Input wrapperClassName='wrapper'>
                                    <Row>
                                        <Col xs={7} sm={4}>
                                            <Input type='text' ref="search" placeholder="Search..." onChange={this.searchFor} addonAfter={searchIcon} />
                                        </Col>
                                        <Col xs={5} sm={5}>
                                            <ButtonLink to="register_piece">
                                                + Artwork
                                            </ButtonLink>
                                        </Col>
                                    </Row>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;