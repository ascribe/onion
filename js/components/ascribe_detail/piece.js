'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import DetailProperty from './detail_property';

import FurtherDetails from './further_details';
import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import MediaContainer from './media_container';

import Header from './header';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';

import RequestActionForm from './../ascribe_forms/form_request_action';
import EditionActions from '../../actions/edition_actions';
import AclButtonList from './../ascribe_buttons/acl_button_list';


import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import apiUrls from '../../constants/api_urls';
import { getLangText } from '../../utils/lang_utils';

/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        loadPiece: React.PropTypes.func
    },

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

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
                    <PieceSummary
                        currentUser={this.state.currentUser}
                        piece={this.props.piece} />
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

let PieceSummary = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    getActions(){
        //let actions = (
        //    <Row>
        //        <Col md={12}>
        //            <AclButtonList
        //                className="text-center ascribe-button-list"
        //                availableAcls={this.props.piece.acl}
        //                editions={[this.props.piece]}
        //                handleSuccess={this.handleSuccess} />
        //        </Col>
        //    </Row>);
        //return actions;
        return null;
    },
    render() {
        return (
            <div className="ascribe-detail-header">
                <DetailProperty label={getLangText('REGISTREE')} value={ this.props.piece.user_registered } />
                <br/>
                {this.getActions()}
                <hr/>
            </div>
        );

    }
});


export default Piece;
