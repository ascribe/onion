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
        currentUser: React.PropTypes.object,
        header: React.PropTypes.object,
        subheader: React.PropTypes.object,
        buttons: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },


    updateObject() {
        return PieceActions.fetchOne(this.props.piece.id);
    },

    render() {
        const { buttons, children, currentUser, header, piece, subheader } = this.props;

        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={piece}
                        currentUser={currentUser}
                        refreshObject={this.updateObject} />
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    {header}
                    {subheader}
                    {buttons}

                    {children}
                </Col>
            </Row>
        );
    }
});

export default Piece;
