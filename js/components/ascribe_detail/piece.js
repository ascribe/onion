'use strict';

import React from 'react';
import Router from 'react-router';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import DetailProperty from './detail_property';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import EditionListActions from '../../actions/edition_list_actions';

import PieceActions from '../../actions/piece_actions';

import MediaContainer from './media_container';

import EditionDetailProperty from './detail_property';

import AclButtonList from './../ascribe_buttons/acl_button_list';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';
import CreateEditionsButton from '../ascribe_buttons/create_editions_button';
import DeleteButton from '../ascribe_buttons/delete_button';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        loadPiece: React.PropTypes.func,
        children: React.PropTypes.object
    },

    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            {
                showCreateEditionsDialog: false
            }
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    handleEditionCreationSuccess() {
        PieceActions.updateProperty({key: 'num_editions', value: 0});
        this.toggleCreateEditionsDialog();
    },

    handleDeleteSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);

        // since we're deleting a piece, we just need to close
        // all editions dialogs and not reload them
        EditionListActions.closeAllEditionLists();
        EditionListActions.clearAllEditionSelections();

        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.transitionTo('pieces');
    },

    getCreateEditionsDialog() {
        if(this.props.piece.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div style={{marginTop: '1em'}}>
                    <CreateEditionsForm
                        pieceId={this.props.piece.id}
                        handleSuccess={this.handleEditionCreationSuccess} />
                    <hr/>
                </div>
            );
        } else {
            return (<hr/>);
        }
    },

    handlePollingSuccess(pieceId, numEditions) {
        PieceActions.updateProperty({
            key: 'num_editions',
            value: numEditions
        });

        let notification = new GlobalNotificationModel('Editions successfully created', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.piece}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <div className="ascribe-detail-header">
                        <EditionDetailProperty label="TITLE" value={<div className="ascribe-detail-title">{this.props.piece.title}</div>} />
                        <EditionDetailProperty label="BY" value={this.props.piece.artist_name} />
                        <EditionDetailProperty label="DATE" value={ this.props.piece.date_created.slice(0, 4) } />
                        {this.props.piece.num_editions > 0 ? <EditionDetailProperty label="EDITIONS" value={ this.props.piece.num_editions } /> : null}
                        <hr/>
                    </div>
                    <div className="ascribe-detail-header">
                        <DetailProperty label={getLangText('REGISTREE')} value={ this.props.piece.user_registered } />
                    </div>

                    <AclButtonList
                        className="text-center ascribe-button-list"
                        availableAcls={this.props.piece.acl}
                        editions={this.props.piece}
                        handleSuccess={this.props.loadPiece}>
                            <CreateEditionsButton
                                label={getLangText('CREATE EDITIONS')}
                                className="btn-sm"
                                piece={this.props.piece}
                                toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                onPollingSuccess={this.handlePollingSuccess}/>
                            <DeleteButton
                                handleSuccess={this.handleDeleteSuccess}
                                piece={this.props.piece}/>
                    </AclButtonList>

                    {this.getCreateEditionsDialog()}
                    {this.props.children}

                </Col>
            </Row>
        );
    }
});

export default Piece;
