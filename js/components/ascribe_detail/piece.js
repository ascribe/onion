'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import PieceActions from '../../actions/piece_actions';

import MediaContainer from './media_container';


/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        header: React.PropTypes.object,
        subheader: React.PropTypes.object,
        buttons: React.PropTypes.object,
        loadPiece: React.PropTypes.func,
        children: React.PropTypes.object
    },


    updateObject() {
        return PieceActions.fetchOne(this.props.piece.id);
    },

    render() {
        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        refreshObject={this.updateObject}
                        content={this.props.piece}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    {this.props.header}
                    {this.props.subheader}
                    {this.props.buttons}

                    {this.props.children}

                </Col>
            </Row>
        );
    }
});

export default Piece;
