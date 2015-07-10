'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import FurtherDetails from './further_details';
//import UserActions from '../../actions/user_actions';
//import UserStore from '../../stores/user_store';

import MediaContainer from './media_container';

import Header from './header';

/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        loadPiece: React.PropTypes.func
    },

    //getInitialState() {
    //    return UserStore.getState();
    //},
    //
    //componentDidMount() {
    //    UserStore.listen(this.onChange);
    //    UserActions.fetchCurrentUser();
    //},
    //
    //componentWillUnmount() {
    //    UserStore.unlisten(this.onChange);
    //},
    //
    //onChange(state) {
    //    this.setState(state);
    //},

    render() {

        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.piece}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <Header
                        content={this.props.piece}/>
                    <CollapsibleParagraph
                        title="Further Details"
                        show={this.props.piece.acl.indexOf('edit') > -1
                            || Object.keys(this.props.piece.extra_data).length > 0
                            || this.props.piece.other_data !== null}
                        defaultExpanded={true}>
                        <FurtherDetails
                            editable={this.props.piece.acl.indexOf('edit') > -1}
                            pieceId={this.props.piece.id}
                            extraData={this.props.piece.extra_data}
                            otherData={this.props.piece.other_data}
                            handleSuccess={this.props.loadPiece}/>
                    </CollapsibleParagraph>

                </Col>
            </Row>
        );
    }
});

export default Piece;
